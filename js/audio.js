/**
 * Catholic Sacred Christmas Soundscape & Background Music Player
 * - Lưu nhạc nền riêng ở thư mục 'music/'
 * - 5 bài nhạc định dạng MP3
 * - Chạy ngẫu nhiên một bài mỗi lần mở trang web
 * - Tên bài hát hiển thị theo tên file nhạc
 * - Đồng thời hỗ trợ Web Audio API cho các hiệu ứng âm thanh tương tác (chuông, nến, chúc lành).
 */

class SacredSoundscape {
  constructor() {
    // Thư mục lưu nhạc nền riêng
    this.musicFolder = 'music/';

    // Danh sách 5 bài hát dạng MP3 trong thư mục music/
    this.playlist = [
      'Khởi My_Hoàng_Rapper_Đơn Giản.mp3',
      'Freddy_Kalas_Vacation.mp3'
    ];

    // Chọn ngẫu nhiên 1 bài hát ngay khi khởi tạo
    this.currentIndex = Math.floor(Math.random() * this.playlist.length);
    this.currentSongFile = this.playlist[this.currentIndex];

    // HTML5 Audio element cho nhạc nền MP3
    this.bgAudio = new Audio();
    this.bgAudio.preload = 'auto';
    this.bgAudio.volume = 0.55;

    this.isPlaying = false;
    this.isMuted = false;
    this.hasUserInteracted = false;

    // Web Audio Context cho hiệu ứng chuông / âm thanh tương tác
    this.ctx = null;
    this.masterGain = null;

    this.setupAudioEvents();
    this.loadCurrentSong();
    this.setupAutoPlayOnFirstInteraction();
  }

  // Cài đặt sự kiện cho Audio Element
  setupAudioEvents() {
    // Khi một bài hát phát hết, tự động chọn ngẫu nhiên bài khác
    this.bgAudio.addEventListener('ended', () => {
      this.nextRandomSong();
    });

    this.bgAudio.addEventListener('play', () => {
      this.isPlaying = true;
      this.updateUI();
    });

    this.bgAudio.addEventListener('pause', () => {
      this.isPlaying = false;
      this.updateUI();
    });

    this.bgAudio.addEventListener('error', (e) => {
      console.warn('Lỗi tải file nhạc:', this.currentSongFile, e);
    });
  }

  // Nạp bài hát hiện tại theo file name
  loadCurrentSong() {
    this.currentSongFile = this.playlist[this.currentIndex];
    this.bgAudio.src = this.musicFolder + encodeURIComponent(this.currentSongFile);
    this.updateUI();
  }

  // Khởi tạo AudioContext cho các hiệu ứng âm thanh
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Phát nhạc nền
  play() {
    this.init();
    const playPromise = this.bgAudio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.isPlaying = true;
          this.updateUI();
        })
        .catch((err) => {
          // Trình duyệt có thể chặn autoplay nếu chưa có tương tác từ người dùng
          console.log('Chờ tương tác người dùng để phát nhạc:', err.message);
          this.isPlaying = false;
          this.updateUI();
        });
    }
  }

  // Dừng phát nhạc nền
  stop() {
    this.bgAudio.pause();
    this.isPlaying = false;
    this.updateUI();
  }

  // Bật / tắt nhạc
  toggleMusic() {
    this.init();
    if (this.isPlaying) {
      this.stop();
    } else {
      this.play();
    }
    return this.isPlaying;
  }

  // Chuyển sang một bài hát ngẫu nhiên khác
  nextRandomSong(event) {
    if (event) event.stopPropagation();
    this.init();

    if (this.playlist.length <= 1) return;

    // Đảm bảo không trùng bài vừa phát
    let newIndex = Math.floor(Math.random() * this.playlist.length);
    if (newIndex === this.currentIndex) {
      newIndex = (this.currentIndex + 1) % this.playlist.length;
    }
    this.currentIndex = newIndex;
    this.loadCurrentSong();

    this.play();
  }

  // Tự động phát khi người dùng tương tác lần đầu với trang web (vượt qua chính sách autoplay của trình duyệt)
  setupAutoPlayOnFirstInteraction() {
    const startAudio = () => {
      if (this.hasUserInteracted) return;
      this.hasUserInteracted = true;

      this.init();
      this.play();

      ['click', 'touchstart', 'keydown'].forEach((evt) => {
        window.removeEventListener(evt, startAudio);
      });
    };

    ['click', 'touchstart', 'keydown'].forEach((evt) => {
      window.addEventListener(evt, startAudio, { once: true, passive: true });
    });

    // Cũng thử tự động phát ngay khi vừa tải trang
    window.addEventListener('DOMContentLoaded', () => {
      this.updateUI();
      this.play();
    });
  }

  // Cập nhật giao diện thanh điều khiển nhạc
  updateUI() {
    const playIcon = document.getElementById('music-play-icon');
    const songNameEl = document.getElementById('music-song-name');
    const waves = document.getElementById('music-waves');
    const btn = document.getElementById('music-toggle-btn');

    // Hiển thị tên bài hát theo tên file nhạc
    if (songNameEl) {
      songNameEl.textContent = this.currentSongFile;
      songNameEl.title = `File: ${this.currentSongFile}`;
    }

    if (playIcon) {
      playIcon.textContent = this.isPlaying ? '⏸️' : '▶️';
    }

    if (waves) {
      if (this.isPlaying) {
        waves.classList.remove('hidden');
      } else {
        waves.classList.add('hidden');
      }
    }

    if (btn) {
      btn.title = this.isPlaying ? `Tạm dừng: ${this.currentSongFile}` : `Phát nhạc: ${this.currentSongFile}`;
    }
  }

  // --- CÁC HIỆU ỨNG ÂM THANH LINH THÁNH (Sound Effects giữ nguyên) ---

  playBellTone(freq, duration = 2.0, volume = 0.2) {
    if (!this.ctx || this.isMuted) return;

    try {
      const t = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, t);

      const osc2 = this.ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2.76, t);

      const gain1 = this.ctx.createGain();
      gain1.gain.setValueAtTime(0, t);
      gain1.gain.linearRampToValueAtTime(volume, t + 0.04);
      gain1.gain.exponentialRampToValueAtTime(0.0001, t + duration);

      const gain2 = this.ctx.createGain();
      gain2.gain.setValueAtTime(0, t);
      gain2.gain.linearRampToValueAtTime(volume * 0.35, t + 0.02);
      gain2.gain.exponentialRampToValueAtTime(0.0001, t + duration * 0.5);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, t);

      osc1.connect(gain1);
      osc2.connect(gain2);
      gain1.connect(filter);
      gain2.connect(filter);
      filter.connect(this.masterGain);

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + duration);
      osc2.stop(t + duration);
    } catch (e) {
      // Bỏ qua lỗi context nếu chưa sẵn sàng
    }
  }

  playChime(type = 'candle') {
    this.init();
    if (this.isMuted || !this.ctx) return;

    const chords = {
      candle: [523.25, 659.25, 783.99, 1046.50],
      step: [440.0, 554.37, 659.25, 880.0],
      prayer: [392.0, 493.88, 587.33, 783.99],
      blessing: [349.23, 440.0, 523.25, 698.46, 880.0]
    };

    const notes = chords[type] || chords.candle;
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playBellTone(freq, 2.5, 0.18);
      }, idx * 90);
    });
  }

  playGrandGloria() {
    this.init();
    if (!this.ctx) return;
    const chords = [
      [261.63, 329.63, 392.00, 523.25],
      [349.23, 440.00, 523.25, 698.46],
      [392.00, 493.88, 587.33, 783.99],
      [523.25, 659.25, 783.99, 1046.50]
    ];

    chords.forEach((chord, step) => {
      setTimeout(() => {
        chord.forEach((f) => this.playBellTone(f, 3.5, 0.2));
      }, step * 600);
    });
  }
}

window.sacredAudio = new SacredSoundscape();
