import "dotenv/config";
import express from "express";
import multer from "multer";
import OpenAI from "openai";

const app = express();
const port = Number(process.env.PORT || 3000);
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 12 * 1024 * 1024 }
});

app.use(express.json({ limit: "12mb" }));
app.use(express.static("public"));

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const tutorInstructions = `
Kamu adalah Numeria AI Tutor, guru matematika virtual yang ramah untuk siswa SMP.
Fokus utama aplikasi adalah materi pola bilangan.
Jawab dalam Bahasa Indonesia yang sederhana, hangat, dan mendukung.
Ajarkan proses berpikir, jangan hanya memberikan jawaban akhir.
Jika siswa meminta pembahasan, jelaskan diketahui, aturan/pola, langkah hitung, dan kesimpulan.
Jika siswa meminta petunjuk, berikan petunjuk bertahap tanpa langsung membocorkan jawaban.
Jika siswa meminta latihan, buat soal sesuai tingkat SMP dan sertakan kunci serta pembahasan terpisah setelah soal.
Jika soal kurang jelas, tanyakan bagian yang perlu diperjelas.
Untuk soal di luar matematika, arahkan dengan sopan kembali ke pembelajaran matematika.
Gunakan format teks yang rapi dan hindari klaim bahwa jawaban pasti benar bila ada ketidakjelasan.
Jangan meminta data pribadi siswa.
`;

const modeInstructions = {
  chat: "Mode: tanya jawab. Jawab pertanyaan siswa dengan jelas.",
  explain: "Mode: pembahasan langkah demi langkah. Uraikan proses secara runtut dan beri alasan tiap langkah.",
  hint: "Mode: petunjuk. Beri satu atau dua petunjuk kecil dahulu. Jangan langsung memberi jawaban akhir kecuali siswa memintanya.",
  exercise: "Mode: latihan otomatis. Buat 3-5 soal sesuai permintaan. Jika tidak disebutkan, buat 3 soal pola bilangan tingkat SMP dari mudah ke sedang. Sertakan pilihan jawaban dan kunci/pembahasan di bagian akhir."
};

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, app: "Numeria AI Tutor", apiKeyConfigured: Boolean(process.env.OPENAI_API_KEY) });
});

app.post("/api/chat", async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({ error: "OPENAI_API_KEY belum diatur. Isi file .env terlebih dahulu." });
    }
    const { message = "", mode = "chat", history = [], image = null } = req.body ?? {};
    if (typeof message !== "string" || message.length > 5000) {
      return res.status(400).json({ error: "Pesan tidak valid atau terlalu panjang." });
    }
    if (!message.trim() && !image) {
      return res.status(400).json({ error: "Tuliskan pertanyaan atau unggah foto soal." });
    }
    const safeHistory = Array.isArray(history) ? history.slice(-10).filter(x =>
      x && ["user", "assistant"].includes(x.role) && typeof x.content === "string"
    ) : [];

    const userContent = [];
    userContent.push({
      type: "input_text",
      text: `${modeInstructions[mode] || modeInstructions.chat}\n\nPertanyaan siswa: ${message || "Baca foto soal ini dan bantu saya menyelesaikannya."}`
    });

    if (image) {
      if (typeof image !== "string" || !/^data:image\/(png|jpeg|jpg|webp);base64,/.test(image)) {
        return res.status(400).json({ error: "Format gambar tidak didukung. Gunakan PNG, JPG, atau WEBP." });
      }
      if (image.length > 10 * 1024 * 1024) {
        return res.status(413).json({ error: "Foto terlalu besar. Kompres foto lalu coba lagi." });
      }
      userContent.push({ type: "input_image", image_url: image, detail: "high" });
    }

    const input = [
      ...safeHistory.map(item => ({ role: item.role, content: item.content })),
      { role: "user", content: userContent }
    ];

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      instructions: tutorInstructions,
      input,
      max_output_tokens: 1200
    });

    res.json({ answer: response.output_text || "Maaf, aku belum mendapatkan jawaban. Coba kirim ulang pertanyaanmu." });
  } catch (error) {
    console.error("Chat API error:", error);
    res.status(500).json({ error: "AI gagal memproses permintaan. Periksa API key, saldo/kredit API, model, dan koneksi server." });
  }
});

app.post("/api/transcribe", upload.single("audio"), async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({ error: "OPENAI_API_KEY belum diatur." });
    }
    if (!req.file) return res.status(400).json({ error: "Rekaman suara tidak ditemukan." });

    const file = new File([req.file.buffer], req.file.originalname || "voice.webm", {
      type: req.file.mimetype || "audio/webm"
    });
    const transcription = await client.audio.transcriptions.create({
      file,
      model: "gpt-4o-mini-transcribe",
      language: "id"
    });
    res.json({ text: transcription.text || "" });
  } catch (error) {
    console.error("Transcription error:", error);
    res.status(500).json({ error: "Gagal mengubah suara menjadi teks. Coba rekam lebih jelas." });
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Numeria AI Tutor berjalan di http://localhost:${port}`);
});
