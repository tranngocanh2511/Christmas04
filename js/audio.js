/**
 * Catholic Sacred Christmas Soundscape & Background Music Player
 * - Tích hợp toàn diện 10 Bài Thánh Ca Giáng Sinh Công Giáo Vui Tươi từ 'nhac-giang-sinh.html'
 * - Phát trực tiếp định dạng OGG / MP3 chất lượng cao
 * - Chạy ngẫu nhiên một bài khi mở trang hoặc chuyển bài tùy thích
 * - Bảng danh sách bài hát (Modal Playlist) xem và chọn bài dễ dàng
 * - Đồng thời hỗ trợ Web Audio API cho các hiệu ứng âm thanh tương tác (chuông, nến, chúc lành).
 */

const SACRED_CHRISTMAS_PLAYLIST = [
  {
    id: 1,
    title: "Joy to the World",
    vnTitle: "Phước Cho Nhân Loại / Niềm Vui Hoan Ca",
    composer: "G.F. Händel & Isaac Watts",
    vibeType: "upbeat",
    vibeText: "Hân hoan • Rộn rã tột bậc",
    badge: "Rộn Ràng Nhất ⭐",
    badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
    audioSrc: "https://commons.wikimedia.org/wiki/Special:FilePath/Joy_To_The_World.ogg",
    format: "audio/ogg",
    desc: "Bản thánh ca Giáng Sinh hân hoan kinh điển nhất nhân loại. Tiết tấu dồn dập, tươi sáng báo tin Chúa Cứu Thế ra đời, cực kỳ thích hợp làm nhạc nền mở đầu website lớp học."
  },
  {
    id: 2,
    title: "Angels We Have Heard on High",
    vnTitle: "Tiếng Hát Thiên Thần / Điệp Khúc Gloria",
    composer: "Thánh ca truyền thống Pháp",
    vibeType: "upbeat",
    vibeText: "Rực rỡ • Ngân nga Gloria",
    badge: "Điệp Khúc Thiên Thần 👼",
    badgeColor: "bg-red-100 text-red-900 border-red-300",
    audioSrc: "https://commons.wikimedia.org/wiki/Special:FilePath/Angels_We_Have_Heard_on_High_(ISRC_USUAN1100329).mp3",
    format: "audio/mpeg",
    desc: "Khúc ca các thiên thần báo tin vui cho mục đồng. Điệp khúc ngân vang 'Gloria in excelsis Deo' các bé thiếu nhi Công giáo rất say mê hát theo."
  },
  {
    id: 3,
    title: "Hark! The Herald Angels Sing",
    vnTitle: "Nghe Thiên Thần Hát Mừng Chúa Ra Đời",
    composer: "Felix Mendelssohn & Charles Wesley",
    vibeType: "upbeat",
    vibeText: "Hành khúc • Tươi sáng • Oai nghiêm",
    badge: "Hành Khúc Vui Tươi ✨",
    badgeColor: "bg-sky-100 text-sky-900 border-sky-300",
    audioSrc: "https://commons.wikimedia.org/wiki/Special:FilePath/HWW_Hark_The_Herald.ogg",
    format: "audio/ogg",
    desc: "Điệu hành khúc của nhà soạn nhạc lừng danh Mendelssohn. Giai điệu tự tin, mang niềm hy vọng và ánh sáng cứu độ, đánh thức sự háo hức trong tâm hồn các bé."
  },
  {
    id: 4,
    title: "The First Noel",
    vnTitle: "Bài Ca Đêm Thánh Đầu Tiên",
    composer: "Thánh ca Giáng sinh truyền thống Anh (TK 18)",
    vibeType: "upbeat",
    vibeText: "Tiếng chuông • Rộn rã • Kể chuyện",
    badge: "Giai Điệu Thân Thương 🔔",
    badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
    audioSrc: "https://commons.wikimedia.org/wiki/Special:FilePath/The_First_Noel_(2020)_-_Starlifter_and_Roots_in_Blue_-_United_States_Air_Force_Band_of_Mid-America.mp3",
    format: "audio/mpeg",
    desc: "Kể lại đêm Con Chúa giáng sinh khi các mục đồng trông thấy ngôi sao lạ phương Đông dẫn đường. Bản thu hòa tấu vui tươi, thích hợp cho các hoạt động kể chuyện Giáng sinh."
  },
  {
    id: 5,
    title: "Go Tell It on the Mountain",
    vnTitle: "Hãy Đi Loan Truyền Trên Núi Đồi",
    composer: "John Wesley Work Jr.",
    vibeType: "upbeat",
    vibeText: "Sôi nổi • Nhún nhảy • Loan tin mừng",
    badge: "Năng Động Tuổi Thơ 🏔️",
    badgeColor: "bg-purple-100 text-purple-900 border-purple-300",
    audioSrc: "https://commons.wikimedia.org/wiki/Special:FilePath/Go_Tell_It_on_the_Mountain_-_Diplomats_-_United_States_Air_Force_Band.mp3",
    format: "audio/mpeg",
    desc: "Giai điệu truyền giáo cực kỳ sôi động: 'Hãy đi loan báo trên khắp đồi núi rằng Chúa Giêsu đã sinh ra!'. Tiết tấu tươi vui khiến các bé không thể ngồi yên, thích hợp cho phần trò chơi đố vui."
  },
  {
    id: 6,
    title: "O Come, All Ye Faithful (Adeste Fideles)",
    vnTitle: "Mau Đến Bê-lem Chiêm Ngắm Chúa",
    composer: "John Francis Wade (1751)",
    vibeType: "gentle",
    vibeText: "Sốt mến • Bước chân hành hương",
    badge: "Lời Mời Yêu Thương 🌟",
    badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
    audioSrc: "https://commons.wikimedia.org/wiki/Special:FilePath/HWW_Oh_Come_All_Ye_Faithful.ogg",
    format: "audio/ogg",
    desc: "Lời rủ nhau tha thiết: 'Hỡi các tín hữu, nào mau cùng nhau đến Bêlem quỳ chiêm ngắm Vua các Thiên Thần!'. Nhịp điệu trang trọng nhưng tràn ngập ấm áp tình Chúa."
  },
  {
    id: 7,
    title: "Away in a Manger",
    vnTitle: "Trong Máng Cỏ Xinh",
    composer: "James R. Murray (1887)",
    vibeType: "gentle",
    vibeText: "Êm ái • Dịu dàng • Lời hát ru",
    badge: "Ngọt Ngào Cho Bé 🕊️",
    badgeColor: "bg-pink-100 text-pink-900 border-pink-300",
    audioSrc: "https://commons.wikimedia.org/wiki/Special:FilePath/Away_in_a_Manger.ogg",
    format: "audio/ogg",
    desc: "Bản thánh ca êm dịu nhất dành cho thiếu nhi: mô tả Chúa Hài Đồng nằm ngủ ngoan trong máng cỏ ấm êm. Rất thích hợp làm nhạc nền góc cầu nguyện hoặc đọc kinh của các bé."
  },
  {
    id: 8,
    title: "Deck the Halls",
    vnTitle: "Rộn Ràng Mừng Mùa Noel Đến",
    composer: "Dân ca xứ Wales cổ truyền",
    vibeType: "upbeat",
    vibeText: "Fa-la-la-la-la • Vui tươi • Lễ hội",
    badge: "Háo Hức Đón Mừng 🎁",
    badgeColor: "bg-green-100 text-green-900 border-green-300",
    audioSrc: "https://commons.wikimedia.org/wiki/Special:FilePath/Deck_the_Halls_(USAFB_Concert_Band).ogg",
    format: "audio/ogg",
    desc: "Điệp khúc 'Fa-la-la-la-la' tưng bừng rộn rã gắn liền với việc chuẩn bị hang đá, trang hoàng nhà thờ và lớp học đón lễ Giáng sinh."
  },
  {
    id: 9,
    title: "Jingle Bells (Bản Hòa Tấu Chuông Ngân)",
    vnTitle: "Tiếng Chuông Giáo Đường Vui Say",
    composer: "James Lord Pierpont",
    vibeType: "upbeat",
    vibeText: "Chuông leng keng • Quen thuộc • Hào hứng",
    badge: "Bé Nào Cũng Mê 🔔",
    badgeColor: "bg-yellow-100 text-yellow-900 border-yellow-300",
    audioSrc: "https://commons.wikimedia.org/wiki/Special:FilePath/Jingle_Bells_Or_The_One_Horse_Open_Sleigh_Complete.ogg",
    format: "audio/ogg",
    desc: "Bản hòa tấu tiếng chuông leng keng rộn rã nhất hành tinh. Vừa bật lên là tạo ngay bầu không khí Giáng sinh ngập tràn tiếng cười cho trẻ em."
  },
  {
    id: 10,
    title: "Silent Night (Stille Nacht)",
    vnTitle: "Đêm Thánh Vô Cùng",
    composer: "Franz Xaver Gruber & Joseph Mohr (1818)",
    vibeType: "gentle",
    vibeText: "Linh thiêng • Sâu lắng • Bình an",
    badge: "Bất Hủ Mọi Thời Đại 🕯️",
    badgeColor: "bg-indigo-100 text-indigo-900 border-indigo-300",
    audioSrc: "https://commons.wikimedia.org/wiki/Special:FilePath/Silent_Night.ogg",
    format: "audio/ogg",
    desc: "Bản thánh ca linh thiêng số 1 của Đêm Giáng Sinh. Giai điệu dịu dàng tôn vinh phút giây Đấng Cứu Độ chào đời. Thích hợp cho giờ tĩnh tâm thắp nến và cầu nguyện của lớp học."
  }
];

class SacredSoundscape {
  constructor() {
    // Danh sách 10 bài nhạc Thánh ca Giáng Sinh
    this.playlist = SACRED_CHRISTMAS_PLAYLIST;

    // Chọn ngẫu nhiên 1 bài hát ngay khi khởi tạo
    this.currentIndex = Math.floor(Math.random() * this.playlist.length);
    this.currentSong = this.playlist[this.currentIndex];
    this.currentSongFile = `${this.currentSong.title} (${this.currentSong.vnTitle})`;

    // HTML5 Audio element cho nhạc nền
    this.bgAudio = new Audio();
    this.bgAudio.preload = 'auto';
    this.bgAudio.volume = 0.55;

    this.isPlaying = false;
    this.isMuted = false;
    this.isLooping = false;
    this.hasUserInteracted = false;
    this.currentFilter = 'all';
    this.searchQuery = '';

    // Web Audio Context cho hiệu ứng chuông / âm thanh tương tác
    this.ctx = null;
    this.masterGain = null;

    this.setupAudioEvents();
    this.loadCurrentSong();
    this.setupAutoPlayOnFirstInteraction();
  }

  // Cài đặt sự kiện cho Audio Element
  setupAudioEvents() {
    // Khi một bài hát phát hết
    this.bgAudio.addEventListener('ended', () => {
      if (this.isLooping) {
        this.bgAudio.currentTime = 0;
        this.bgAudio.play().catch(() => {});
      } else {
        this.nextRandomSong();
      }
    });

    this.bgAudio.addEventListener('play', () => {
      this.isPlaying = true;
      this.updateUI();
      this.renderModalSongs();
    });

    this.bgAudio.addEventListener('pause', () => {
      this.isPlaying = false;
      this.updateUI();
      this.renderModalSongs();
    });

    this.bgAudio.addEventListener('error', (e) => {
      console.warn('Lỗi tải file nhạc:', this.currentSong ? this.currentSong.title : '', e);
    });
  }

  // Nạp bài hát hiện tại
  loadCurrentSong() {
    this.currentSong = this.playlist[this.currentIndex];
    this.currentSongFile = `${this.currentSong.title} (${this.currentSong.vnTitle})`;
    this.bgAudio.src = this.currentSong.audioSrc;
    this.updateUI();
    this.renderModalSongs();
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
          this.renderModalSongs();
        })
        .catch((err) => {
          console.log('Chờ tương tác người dùng để phát nhạc:', err.message);
          this.isPlaying = false;
          this.updateUI();
          this.renderModalSongs();
        });
    }
  }

  // Dừng phát nhạc nền
  stop() {
    this.bgAudio.pause();
    this.isPlaying = false;
    this.updateUI();
    this.renderModalSongs();
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

  // Phát một bài cụ thể theo id (1-based) hoặc index (0-based)
  playSongById(id) {
    const index = this.playlist.findIndex((s) => s.id === id);
    if (index !== -1) {
      this.playSong(index);
    }
  }

  playSong(index) {
    this.init();
    if (index === this.currentIndex) {
      if (this.isPlaying) {
        this.stop();
      } else {
        this.play();
      }
      return;
    }

    this.currentIndex = index;
    this.loadCurrentSong();
    this.play();
  }

  // Chuyển sang một bài hát ngẫu nhiên khác
  nextRandomSong(event) {
    if (event) event.stopPropagation();
    this.init();

    if (this.playlist.length <= 1) return;

    let newIndex = Math.floor(Math.random() * this.playlist.length);
    if (newIndex === this.currentIndex) {
      newIndex = (this.currentIndex + 1) % this.playlist.length;
    }
    this.currentIndex = newIndex;
    this.loadCurrentSong();
    this.play();
  }

  // Bài kế tiếp
  playNext(event) {
    if (event) event.stopPropagation();
    this.init();
    this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
    this.loadCurrentSong();
    this.play();
  }

  // Bài trước
  playPrev(event) {
    if (event) event.stopPropagation();
    this.init();
    this.currentIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
    this.loadCurrentSong();
    this.play();
  }

  // Bật / tắt lặp lại 1 bài
  toggleLoop() {
    this.isLooping = !this.isLooping;
    const loopBtn = document.getElementById('modal-loop-btn');
    const loopText = document.getElementById('modal-loop-text');
    if (loopBtn) {
      if (this.isLooping) {
        loopBtn.classList.add('border-amber-400', 'text-amber-400', 'bg-amber-950/40');
        loopBtn.classList.remove('text-slate-400');
        if (loopText) loopText.textContent = 'Lặp bài: Bật';
      } else {
        loopBtn.classList.remove('border-amber-400', 'text-amber-400', 'bg-amber-950/40');
        loopBtn.classList.add('text-slate-400');
        if (loopText) loopText.textContent = 'Lặp bài: Tắt';
      }
    }
  }

  // Điều chỉnh âm lượng
  setVolume(val) {
    const v = parseFloat(val);
    if (!isNaN(v)) {
      this.bgAudio.volume = Math.max(0, Math.min(1, v));
    }
  }

  // Tự động phát khi người dùng tương tác lần đầu
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

    const song = this.playlist[this.currentIndex];

    if (songNameEl && song) {
      songNameEl.textContent = `${song.title} (${song.vnTitle})`;
      songNameEl.title = `${song.title} - ${song.vnTitle} (${song.composer})`;
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

    if (btn && song) {
      btn.title = this.isPlaying ? `Tạm dừng: ${song.title}` : `Phát nhạc: ${song.title}`;
    }

    // Modal Dock update
    const modalPlayIcon = document.getElementById('modal-dock-play-icon');
    const modalTitle = document.getElementById('modal-dock-title');
    const modalSub = document.getElementById('modal-dock-sub');
    const modalVibe = document.getElementById('modal-dock-vibe');

    if (modalPlayIcon) {
      modalPlayIcon.textContent = this.isPlaying ? '⏸️' : '▶️';
    }
    if (modalTitle && song) {
      modalTitle.textContent = `${song.id < 10 ? '0' + song.id : song.id}. ${song.title}`;
    }
    if (modalSub && song) {
      modalSub.textContent = `${song.vnTitle} • ${song.composer}`;
    }
    if (modalVibe && song) {
      modalVibe.textContent = `${song.vibeText} • ${song.badge}`;
    }
  }

  // --- PLAYLIST MODAL MANAGEMENT ---

  openPlaylistModal(event) {
    if (event) event.stopPropagation();
    const modal = document.getElementById('sacred-music-modal');
    const card = document.getElementById('sacred-music-card');
    if (!modal || !card) return;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    this.renderModalSongs();

    requestAnimationFrame(() => {
      card.classList.remove('scale-95', 'opacity-0');
      card.classList.add('scale-100', 'opacity-100');
    });

    // Scroll active song into view if possible
    setTimeout(() => {
      const activeEl = document.getElementById(`modal-song-row-${this.currentIndex}`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 150);
  }

  closePlaylistModal() {
    const modal = document.getElementById('sacred-music-modal');
    const card = document.getElementById('sacred-music-card');
    if (!modal || !card) return;

    card.classList.remove('scale-100', 'opacity-100');
    card.classList.add('scale-95', 'opacity-0');

    setTimeout(() => {
      modal.classList.remove('flex');
      modal.classList.add('hidden');
    }, 250);
  }

  setFilter(type) {
    this.currentFilter = type;
    ['all', 'upbeat', 'gentle'].forEach((t) => {
      const btn = document.getElementById(`modal-filter-${t}`);
      if (btn) {
        if (t === type) {
          btn.className = 'px-3 py-1.5 rounded-full bg-amber-500 text-slate-950 font-black shadow-xs transition';
        } else {
          btn.className = 'px-3 py-1.5 rounded-full bg-white hover:bg-amber-100 text-slate-700 transition border border-amber-200';
        }
      }
    });
    this.renderModalSongs();
  }

  searchSongs(query) {
    this.searchQuery = (query || '').trim().toLowerCase();
    this.renderModalSongs();
  }

  renderModalSongs() {
    const listContainer = document.getElementById('sacred-music-modal-list');
    if (!listContainer) return;

    const filtered = this.playlist.filter((song) => {
      if (this.currentFilter !== 'all' && song.vibeType !== this.currentFilter) return false;
      if (this.searchQuery) {
        const q = this.searchQuery;
        return (
          song.title.toLowerCase().includes(q) ||
          song.vnTitle.toLowerCase().includes(q) ||
          song.composer.toLowerCase().includes(q) ||
          song.desc.toLowerCase().includes(q)
        );
      }
      return true;
    });

    if (filtered.length === 0) {
      listContainer.innerHTML = `
        <div class="text-center py-10 bg-white/70 rounded-2xl border border-dashed border-amber-300">
          <span class="text-3xl">🔍</span>
          <p class="font-bold text-slate-700 mt-2 text-sm">Không tìm thấy bài hát nào phù hợp!</p>
          <p class="text-xs text-slate-500 mt-1">Hãy thử xóa bộ lọc hoặc gõ từ khóa khác</p>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = filtered
      .map((song) => {
        const originalIndex = this.playlist.findIndex((s) => s.id === song.id);
        const isCurrent = originalIndex === this.currentIndex;
        const isCurrentPlaying = isCurrent && this.isPlaying;

        return `
          <div id="modal-song-row-${originalIndex}"
               onclick="window.sacredAudio.playSong(${originalIndex})"
               class="cursor-pointer group rounded-2xl p-3.5 sm:p-4 border-2 transition-all duration-200 flex items-center justify-between gap-3 ${
                 isCurrentPlaying
                   ? 'border-amber-400 bg-amber-50 shadow-md ring-2 ring-amber-300/60'
                   : isCurrent
                   ? 'border-amber-300 bg-amber-50/50'
                   : 'border-amber-100 bg-white hover:border-amber-300 hover:bg-amber-50/30'
               }">
            
            <!-- Left: Number & Play button & Info -->
            <div class="flex items-center gap-3 min-w-0 flex-1">
              
              <!-- Play / Pause Circle -->
              <button onclick="event.stopPropagation(); window.sacredAudio.playSong(${originalIndex})"
                      class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow transition-transform group-hover:scale-105 active:scale-95 ${
                        isCurrentPlaying
                          ? 'bg-amber-500 text-slate-950 music-pulse-glow'
                          : 'bg-amber-100 group-hover:bg-amber-400 text-amber-900 group-hover:text-slate-950'
                      }">
                <span class="text-xs">${isCurrentPlaying ? '⏸️' : '▶️'}</span>
              </button>

              <!-- Equalizer Wave indicator when playing -->
              <div class="${isCurrentPlaying ? 'flex' : 'hidden'} items-end gap-0.5 h-4 flex-shrink-0">
                <span class="w-1 bg-amber-600 rounded-full eq-bar-1"></span>
                <span class="w-1 bg-amber-500 rounded-full eq-bar-2"></span>
                <span class="w-1 bg-yellow-500 rounded-full eq-bar-3"></span>
                <span class="w-1 bg-amber-600 rounded-full eq-bar-4"></span>
              </div>

              <!-- Details -->
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <span class="text-[10px] font-black px-1.5 py-0.5 rounded-full ${song.badgeColor} border">
                    ${song.badge}
                  </span>
                  <span class="text-xs font-black text-amber-950 truncate">
                    ${song.id < 10 ? '0' + song.id : song.id}. ${song.title}
                  </span>
                </div>
                <div class="text-xs text-amber-900 font-bold truncate">
                  ${song.vnTitle}
                </div>
                <p class="text-[11px] text-slate-500 truncate hidden sm:block">
                  Tác giả: ${song.composer} • ${song.vibeText}
                </p>
              </div>
            </div>

            <!-- Right: Status / Action -->
            <div class="flex items-center gap-2 flex-shrink-0">
              <span class="text-[11px] font-bold px-2 py-1 rounded-full ${
                isCurrentPlaying
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-slate-100 text-slate-600 group-hover:bg-amber-100 group-hover:text-amber-900'
              }">
                ${isCurrentPlaying ? '🔊 Đang phát' : 'Nghe'}
              </span>
            </div>

          </div>
        `;
      })
      .join('');
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
      candle: [523.25, 659.25, 783.99, 1046.5],
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
      [261.63, 329.63, 392.0, 523.25],
      [349.23, 440.0, 523.25, 698.46],
      [392.0, 493.88, 587.33, 783.99],
      [523.25, 659.25, 783.99, 1046.5]
    ];

    chords.forEach((chord, step) => {
      setTimeout(() => {
        chord.forEach((f) => this.playBellTone(f, 3.5, 0.2));
      }, step * 600);
    });
  }
}

window.sacredAudio = new SacredSoundscape();
