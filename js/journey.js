/**
 * Quản lý lưu trữ Hình Ảnh / Video Nhiệm Vụ qua IndexedDB
 */
class TaskMediaDB {
  constructor() {
    this.dbName = 'ChristmasJourneyDB';
    this.storeName = 'taskMedia';
  }

  async openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'key' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async saveMedia(key, mediaObj) {
    try {
      const db = await this.openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(this.storeName, 'readwrite');
        const store = tx.objectStore(this.storeName);
        store.put({ key, ...mediaObj });
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => reject(tx.error);
      });
    } catch (err) {
      console.warn('IndexedDB save error:', err);
      return false;
    }
  }

  async getAllMedia() {
    try {
      const db = await this.openDB();
      return new Promise((resolve) => {
        const tx = db.transaction(this.storeName, 'readonly');
        const store = tx.objectStore(this.storeName);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      });
    } catch (err) {
      return [];
    }
  }

  async deleteMedia(key) {
    try {
      const db = await this.openDB();
      return new Promise((resolve) => {
        const tx = db.transaction(this.storeName, 'readwrite');
        const store = tx.objectStore(this.storeName);
        store.delete(key);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      });
    } catch (err) {
      return false;
    }
  }
}

/**
 * Hành Trình Đức Tin - Light of Christmas
 */
class FaithJourney {
  constructor() {
    this.milestones = {
      hero: false,
      advent: [false, false, false, false],
      dailyPrayer: false,
      letterOffered: false,
      nativityAdored: false
    };

    // ========================================================
    // ⚙️ CẤU HÌNH THỜI GIAN TỰ ĐỘNG XUẤT HIỆN BẢNG LỜI NGUYỆN
    // Bạn có thể tùy ý sửa GIỜ và PHÚT tại 2 dòng dưới đây:
    // ========================================================
    this.prayerScheduleConfig = {
      hour: 19,    // Giờ (0 đến 23) -> Ví dụ: 19 là 19h (7 giờ tối), 20 là 20h, 6 là 6h sáng
      minute: 20   // Phút (0 đến 59) -> Ví dụ: 20 là phút thứ 20, 30 là phút thứ 30
    };

    // Kho Lời Cầu Nguyện Tĩnh Tâm Hằng Ngày (sáng, trưa, tối, Mùa Vọng)
    this.dailyPrayers = [
      {
        id: 'evening-1',
        period: 'evening',
        periodName: 'Lời cầu nguyện buổi tối',
        content: 'Sương đêm buông xuống, xin Chúa bao bọc căn phòng nhỏ của con bằng sự bình an sâu thẳm. Cho con rũ bỏ mọi căng thẳng đè nặng trên vai, thả lỏng toàn thân và chìm vào giấc ngủ thật an lành.',
        subtext: 'Bình an trong giấc ngủ thánh thiện'
      },
      {
        id: 'morning-1',
        period: 'morning',
        periodName: 'Lời cầu nguyện buổi sáng',
        content: 'Tạ ơn Chúa vì một ngày mới chan hòa ánh sáng. Xin soi sáng trí lòng con, ban cho con sự khôn ngoan, lòng hiền hậu và đôi tay sẵn sàng gieo rắc yêu thương đến mọi người xung quanh.',
        subtext: 'Khởi đầu ngày mới với niềm cậy trông'
      },
      {
        id: 'noon-1',
        period: 'noon',
        periodName: 'Lời cầu nguyện ban trưa',
        content: 'Lạy Chúa Giêsu, giữa những bận rộn của ngày sống, xin ban cho con một phút lắng đọng để nhận ra sự hiện diện của Ngài. Xin ban sức mạnh và niềm vui để con chu toàn mọi bổn phận.',
        subtext: 'Điểm tựa bình an giữa ngày'
      },
      {
        id: 'evening-2',
        period: 'evening',
        periodName: 'Lời cầu nguyện buổi tối',
        content: 'Lạy Chúa, một ngày nữa đã khép lại. Con xin dâng lên Chúa mọi niềm vui, nỗi buồn và việc lành của ngày hôm nay. Xin gìn giữ gia đình con trong giấc ngủ an lành dưới bóng chở che của Ngài.',
        subtext: 'Tạ ơn một ngày đã qua'
      },
      {
        id: 'advent-1',
        period: 'advent',
        periodName: 'Lời nguyện Mùa Vọng Bêlem',
        content: 'Lạy Chúa Hài Đồng Giêsu, xin ngự đến trong tâm hồn con như máng cỏ ấm áp đêm đông. Xin thắp sáng trong lòng con ngọn lửa hy vọng, đức tin và tình yêu thương chan chứa.',
        subtext: 'Dọn lòng đón Chúa Giáng Sinh'
      }
    ];

    // Tự động chọn lời nguyện theo buổi hiện tại
    const curHour = new Date().getHours();
    if (curHour >= 18 || curHour < 5) {
      this.currentPrayerIndex = 0; // Buổi tối (như trong ảnh mẫu)
    } else if (curHour >= 5 && curHour < 11) {
      this.currentPrayerIndex = 1; // Buổi sáng
    } else if (curHour >= 11 && curHour < 15) {
      this.currentPrayerIndex = 2; // Buổi trưa
    } else {
      this.currentPrayerIndex = 0; // Buổi chiều tối
    }

    // Biến điều khiển kích hoạt bảng lời nguyện
    this.prayerClickCount = 0;
    this.hasAutoTriggeredAfter10s = false;
    this.isPrayerModalOpen = false;
    this.prayerCountdownInterval = null;
    this.prayerSecondsLeft = 10;
    this.lastPrayerClosedTime = 0;
    this.hasCompletedDailyPrayer = false;

    // Quản lý lưu trữ ảnh & video tải lên theo từng nhiệm vụ
    this.taskMedia = {};
    this.mediaDB = new TaskMediaDB();

    // Quản lý 4 tuần Mùa Vọng và 3 nhiệm vụ tương ứng mỗi tuần
    this.currentStarWeek = 0; // 0: Tuần 1, 1: Tuần 2, 2: Tuần 3, 3: Tuần 4
    this.completedStarTasks = {
      0: [false, false, false],
      1: [false, false, false],
      2: [false, false, false],
      3: [false, false, false]
    };

    this.cardRecipientName = 'Gia Đình Thân Yêu';

    // Dữ liệu 4 tuần Mùa Vọng & các nhiệm vụ của Dõi Theo Ánh Sao
    this.starWeeksData = [
      {
        weekIndex: 0,
        weekName: "Tuần 1",
        weekTitle: "Tuần 1: Hy Vọng",
        candleColor: "bg-purple-100 text-purple-900 border-purple-300",
        activeTabClass: "bg-purple-600 text-white border-purple-700 shadow-md",
        tasks: [
          {
            id: 'mass',
            title: "THAM DỰ THÁNH LỄ CN",
            icon: "⛪",
            subtext: "Hiệp dâng Thánh Lễ Chúa Nhật",
            message: "Cùng gia đình đến nhà thờ hiệp dâng Thánh Lễ sốt sắng đón chờ Chúa đến.",
            reflection: "Thánh Lễ Chúa Nhật là ngọn hải đăng đức tin soi đường cho con trong suốt tuần mới. Hãy giữ tâm hồn trong sáng, lắng nghe tiếng Chúa và hiệp thông cùng cộng đoàn.",
            actionText: "Con quyết tâm tham dự Thánh Lễ sốt sắng"
          },
          {
            id: 'word',
            title: "LỜI CHÚA",
            icon: "📖",
            subtext: "Lắng nghe trang Tin Mừng",
            message: "Mở trang Kinh Thánh hoặc lắng nghe Lời Chúa trong tuần Hy Vọng này.",
            reflection: "“Lời Chúa là ngọn đèn soi cho con bước, là ánh sáng chỉ đường con đi.” (Thánh Vịnh 119:105). Lời Chúa thắp lên trong lòng con niềm hy vọng rạng ngời.",
            actionText: "Con mở lòng lắng nghe và sống Lời Chúa"
          },
          {
            id: 'forgive',
            title: "THA THỨ",
            icon: "❤️",
            subtext: "Mỉm cười làm hòa",
            message: "Bỏ qua lỗi lầm của bạn bè, anh chị em và trao nhau nụ cười ấm áp.",
            reflection: "Tha thứ không làm thay đổi quá khứ, nhưng mở ra tương lai rạng ngời và giúp trái tim bé nhỏ của con tràn ngập bình an như máng cỏ ấm êm đón Chúa.",
            actionText: "Con chọn tha thứ và yêu thương làm hòa"
          }
        ]
      },
      {
        weekIndex: 1,
        weekName: "Tuần 2",
        weekTitle: "Tuần 2: Đức Tin",
        candleColor: "bg-purple-100 text-purple-900 border-purple-300",
        activeTabClass: "bg-indigo-600 text-white border-indigo-700 shadow-md",
        tasks: [
          {
            id: 'mass',
            title: "THAM DỰ THÁNH LỄ CN",
            icon: "⛪",
            subtext: "Nuôi dưỡng mầm sống Đức Tin",
            message: "Tham dự Thánh Lễ Chúa Nhật để củng cố đức tin son sắt nơi Thiên Chúa.",
            reflection: "Mỗi khi đến với Thánh Lễ, Chúa Giêsu ban thêm đức tin và sức mạnh để con luôn can đảm làm điều thiện và yêu thương mọi người.",
            actionText: "Con trung thành tham dự Thánh Lễ Chúa Nhật"
          },
          {
            id: 'word',
            title: "LỜI CHÚA",
            icon: "📖",
            subtext: "Suy niệm Lời Hằng Sống",
            message: "Lắng nghe Lời Chúa kêu gọi dọn đường cho Đấng Cứu Thế ngự vào tâm hồn.",
            reflection: "“Hãy dọn sẵn con đường cho Đức Chúa, sửa lối cho thẳng để Người đi.” (Mt 3:3). Đức tin sống động bắt đầu từ việc lắng nghe và vâng giữ Lời Ngài.",
            actionText: "Con tin cậy và bước theo Lời Chúa chỉ dạy"
          },
          {
            id: 'gratitude',
            title: "TRI ÂN",
            icon: "🌹",
            subtext: "Cảm tạ Chúa & Tri ân mọi người",
            message: "Cảm tạ Chúa vì muôn hồng ân và biết ơn ông bà, cha mẹ, thầy cô.",
            reflection: "Lòng tri ân là lời ca tụng đẹp nhất dâng lên Chúa. Biết ơn giúp đôi mắt đức tin của con luôn nhận ra những điều kỳ diệu và phúc lành Chúa trao ban mỗi ngày.",
            actionText: "Con tạ ơn Chúa và cảm ơn cha mẹ với trọn lòng tri ân"
          }
        ]
      },
      {
        weekIndex: 2,
        weekName: "Tuần 3",
        weekTitle: "Tuần 3: Niềm Vui",
        candleColor: "bg-pink-100 text-pink-900 border-pink-300",
        activeTabClass: "bg-rose-500 text-white border-rose-600 shadow-md",
        tasks: [
          {
            id: 'mass',
            title: "THAM DỰ THÁNH LỄ CN",
            icon: "⛪",
            subtext: "Thánh Lễ Niềm Vui (Gaudete)",
            message: "Hiệp dâng Thánh Lễ Chúa Nhật thứ 3 trong sắc hồng rạng rỡ của Niềm Vui ơn cứu độ.",
            reflection: "“Anh em hãy vui mừng luôn trong Chúa! Tôi nhắc lại: anh em hãy vui mừng lên!” (Pl 4:4). Thánh Lễ tuần 3 mang niềm vui Giáng Sinh đến thật gần.",
            actionText: "Con dâng Thánh Lễ với trọn vẹn niềm hân hoan"
          },
          {
            id: 'word',
            title: "LỜI CHÚA",
            icon: "📖",
            subtext: "Tin Mừng Mang Niềm Vui",
            message: "Để Lời Chúa thổi bùng ngọn lửa hân hoan tươi vui trong trái tim bé nhỏ.",
            reflection: "Tin Mừng là tin vui cứu độ cho toàn nhân loại. Đọc Lời Chúa giúp khuôn mặt con luôn tươi vui và đem lại nụ cười cho mọi người xung quanh.",
            actionText: "Con lan tỏa niềm vui của Lời Chúa đến mọi người"
          },
          {
            id: 'charity',
            title: "BÁC ÁI",
            icon: "🤝",
            subtext: "Chia sẻ & Giúp đỡ tha nhân",
            message: "Làm một việc bác ái: chia sẻ kẹo bánh, đồ chơi, giúp đỡ người già hoặc bạn khó khăn.",
            reflection: "“Mỗi lần các con làm như thế cho một trong những anh em bé mọn nhất của Thầy đây, là các con đã làm cho chính Thầy.” (Mt 25:40). Bác ái là món quà quý giá nhất dâng Chúa Hài Đồng.",
            actionText: "Con thực hiện một việc bác ái cụ thể hôm nay"
          }
        ]
      },
      {
        weekIndex: 3,
        weekName: "Tuần 4",
        weekTitle: "Tuần 4: Hy Vọng",
        candleColor: "bg-purple-100 text-purple-900 border-purple-300",
        activeTabClass: "bg-amber-500 text-white border-amber-600 shadow-md",
        tasks: [
          {
            id: 'mass',
            title: "THAM DỰ THÁNH LỄ CN",
            icon: "⛪",
            subtext: "Thánh Lễ Đón Chúa Hài Đồng",
            message: "Tham dự Thánh Lễ Chúa Nhật Tuần 4 với tâm hồn hồi hộp sẵn sàng chào đón Đấng Cứu Thế.",
            reflection: "Chỉ còn ít ngày nữa là Đêm Thánh Vô Cùng. Thánh Lễ này là giờ phút linh thiêng để con quỳ bên Chúa và thưa tiếng 'Xin Vâng' như Mẹ Maria.",
            actionText: "Con sốt sắng tham dự Thánh Lễ đón Chúa ra đời"
          },
          {
            id: 'word',
            title: "LỜI CHÚA",
            icon: "📖",
            subtext: "Mầu Nhiệm Nhập Thể",
            message: "Lắng nghe lời thiên sứ truyền tin và lời hứa cứu độ được hoàn tất nơi Hài Nhi Giêsu.",
            reflection: "“Thánh Thần sẽ ngự xuống trên bà, và quyền năng Đấng Tối Cao sẽ rợp bóng trên bà.” (Lc 1:35). Lời Chúa thắp sáng niềm hy vọng chan chứa cho nhân loại.",
            actionText: "Con mở rộng lòng đón Chúa ngự vào tâm hồn"
          },
          {
            id: 'card',
            title: "THIỆP GIÁNG SINH",
            icon: "💌",
            subtext: "Thêm tên & Popup gửi thiệp chúc lành",
            message: "Viết thiệp Giáng Sinh trao gửi lời cầu chúc yêu thương đến cha mẹ, bạn bè và người thân!",
            reflection: "Một cánh thiệp Giáng Sinh tự tay con thêm tên người nhận mang theo muôn ân phúc và sự ấm áp trong mùa đông Giáng Sinh.",
            actionText: "Bấm để Mở Thiệp & Thêm Tên Chúc Mừng ✨"
          }
        ]
      }
    ];

    this.adventDetails = [
      {
        week: 1,
        title: "TUẦN 1 – HY VỌNG",
        color: "#c084fc",
        message: "Khi con đường phía trước còn mịt mờ, con hãy cứ hy vọng. Chúa luôn ở bên con.",
        reflection: "Hôm nay con muốn trao phó điều gì vào đôi bàn tay yêu thương của Chúa?",
        action: "KHÁM PHÁ NHIỆM VỤ TUẦN 1 →"
      },
      {
        week: 2,
        title: "TUẦN 2 – ĐỨC TIN",
        color: "#c084fc",
        message: "Đức tin là tin tưởng Chúa ngay cả khi chúng ta chưa nhìn thấy trọn vẹn con đường.",
        reflection: "Con cần phó thác nỗi lo lắng nào cho Chúa hôm nay?",
        action: "KHÁM PHÁ NHIỆM VỤ TUẦN 2 →"
      },
      {
        week: 3,
        title: "TUẦN 3 – NIỀM VUI",
        color: "#f472b6",
        message: "Niềm vui Giáng Sinh bắt đầu khi con nhận ra mình được Chúa yêu thương vô ngần.",
        reflection: "Hôm nay con có thể mang một nụ cười hay niềm vui đến cho ai?",
        action: "KHÁM PHÁ NHIỆM VỤ TUẦN 3 →"
      },
      {
        week: 4,
        title: "TUẦN 4 – HY VỌNG",
        color: "#c084fc",
        message: "Hy vọng ngày Chúa giáng trần ngập tràn ánh sáng tình yêu và ơn cứu độ.",
        reflection: "Con chuẩn bị máng cỏ tâm hồn như thế nào để đón rước Chúa Hài Đồng?",
        action: "KHÁM PHÁ NHIỆM VỤ TUẦN 4 →"
      }
    ];

    this.init();
  }

  async init() {
    await this.loadAllTaskMedia();
    this.renderStarTasks(this.currentStarWeek);
    this.updateDailyPrayerTaskCard();
    this.initPrayerTriggers();
    this.updateNativityPuzzleUI();
    this.updateProgressUI();
  }

  async loadAllTaskMedia() {
    try {
      const all = await this.mediaDB.getAllMedia();
      all.forEach(item => {
        if (item && item.key) {
          this.taskMedia[item.key] = item;
          // Tự động ghi nhận hoàn thành nhiệm vụ nếu đã có ảnh/video minh chứng
          if (item.weekIndex !== undefined && item.taskIndex !== undefined) {
            if (this.completedStarTasks[item.weekIndex]) {
              this.completedStarTasks[item.weekIndex][item.taskIndex] = true;
            }
          }
        }
      });
    } catch (e) {
      console.warn('Error loading task media:', e);
    }
  }

  async handleTaskMediaUpload(weekIndex, taskIndex, event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    if (!isImage && !isVideo) {
      alert('Vui lòng chọn tệp hình ảnh hoặc video hợp lệ!');
      return;
    }

    // Giới hạn 100MB cho video / ảnh
    if (file.size > 100 * 1024 * 1024) {
      alert('Tệp quá lớn (vui lòng chọn tệp dưới 100MB)!');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const mediaObj = {
        weekIndex,
        taskIndex,
        name: file.name,
        type: isVideo ? 'video' : 'image',
        dataUrl: reader.result,
        size: (file.size / 1024).toFixed(1) + ' KB',
        uploadedAt: new Date().toLocaleString('vi-VN')
      };

      const key = `${weekIndex}_${taskIndex}`;
      this.taskMedia[key] = mediaObj;
      await this.mediaDB.saveMedia(key, mediaObj);

      // Đánh dấu nhiệm vụ đã hoàn thành
      this.completedStarTasks[weekIndex][taskIndex] = true;

      if (window.sacredAudio) {
        window.sacredAudio.playChime('blessing');
      }

      this.renderStarTasks(weekIndex);
      this.showTaskReflection(weekIndex, taskIndex);
      this.updateStarOfBethlehem();
      this.updateNativityPuzzleUI();
      this.updateProgressUI();
    };
    reader.readAsDataURL(file);
  }

  async deleteTaskMedia(weekIndex, taskIndex, event) {
    if (event) event.stopPropagation();
    if (!confirm('Bé có chắc muốn xóa ảnh / video kỷ niệm này không?')) return;

    const key = `${weekIndex}_${taskIndex}`;
    delete this.taskMedia[key];
    await this.mediaDB.deleteMedia(key);

    this.renderStarTasks(weekIndex);
    this.showTaskReflection(weekIndex, taskIndex);
  }

  openMediaViewer(weekIndex, taskIndex, event) {
    if (event) event.stopPropagation();
    const key = `${weekIndex}_${taskIndex}`;
    const media = this.taskMedia[key];
    if (!media) return;

    const modal = document.getElementById('task-media-viewer-modal');
    const titleEl = document.getElementById('media-viewer-title');
    const contentEl = document.getElementById('media-viewer-content');
    const timeEl = document.getElementById('media-viewer-time');
    const downloadBtn = document.getElementById('media-viewer-download');

    const weekData = this.starWeeksData[weekIndex];
    const task = weekData.tasks[taskIndex];

    if (titleEl) {
      titleEl.innerHTML = `<span>${task.icon}</span> <span>${weekData.weekTitle} • ${task.title}</span>`;
    }
    if (timeEl) {
      timeEl.textContent = `Tải lên lúc: ${media.uploadedAt} • Tên tệp: ${media.name}`;
    }
    if (downloadBtn) {
      downloadBtn.href = media.dataUrl;
      downloadBtn.download = media.name || 'ky-niem-giang-sinh';
    }

    if (contentEl) {
      if (media.type === 'video') {
        contentEl.innerHTML = `
          <video controls autoplay class="max-h-[68vh] max-w-full rounded-2xl shadow-2xl mx-auto border-2 border-amber-300">
            <source src="${media.dataUrl}">
            Trình duyệt không hỗ trợ xem video này.
          </video>
        `;
      } else {
        contentEl.innerHTML = `
          <img src="${media.dataUrl}" alt="${media.name}" class="max-h-[68vh] max-w-full rounded-2xl shadow-2xl mx-auto border-2 border-amber-300 object-contain">
        `;
      }
    }

    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
  }

  closeMediaViewer() {
    const modal = document.getElementById('task-media-viewer-modal');
    const contentEl = document.getElementById('media-viewer-content');
    if (contentEl) {
      contentEl.innerHTML = '';
    }
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  }

  beginJourney(event) {
    if (window.sacredAudio) {
      window.sacredAudio.init();
      if (!window.sacredAudio.isPlaying) {
        window.sacredAudio.play();
      }
      window.sacredAudio.playChime('candle');
    }

    if (window.celestialSky && event) {
      window.celestialSky.addStardustBurst(event.clientX || window.innerWidth / 2, event.clientY || 300, 45);
    }

    this.milestones.hero = true;
    this.updateProgressUI();

    const target = document.getElementById('advent-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Thắp sáng nến Mùa Vọng và tự động chuyển tab Dõi theo ánh sao sang tuần đó
  lightAdventCandle(index, event) {
    this.milestones.advent[index] = true;
    if (window.sacredAudio) {
      window.sacredAudio.playChime('candle');
    }

    if (window.celestialSky && event) {
      const rect = event.currentTarget.getBoundingClientRect();
      window.celestialSky.addStardustBurst(rect.left + rect.width / 2, rect.top + 30, 30);
    }

    const candleEl = document.getElementById(`advent-candle-${index}`);
    if (candleEl) {
      const flame = candleEl.querySelector('.candle-flame');
      const aura = candleEl.querySelector('.candle-aura');
      const statusPill = candleEl.querySelector('.candle-status');
      if (flame) flame.classList.remove('opacity-0', 'scale-0');
      if (aura) aura.classList.remove('opacity-0');
      if (statusPill) {
        statusPill.innerHTML = '<span class="text-amber-600 font-extrabold">✨ Đã Thắp Sáng</span>';
      }
    }

    this.switchStarWeek(index);
    this.updateNativityPuzzleUI(index);
    this.openAdventModal(index);
    this.updateProgressUI();
  }

  openAdventModal(index) {
    const data = this.adventDetails[index];
    const modal = document.getElementById('advent-modal');
    if (!modal) return;

    document.getElementById('advent-modal-title').textContent = data.title;
    document.getElementById('advent-modal-msg').textContent = `“${data.message}”`;
    document.getElementById('advent-modal-reflection').textContent = data.reflection;
    
    const actionBtn = document.getElementById('advent-modal-action-btn');
    if (actionBtn) {
      actionBtn.textContent = `✨ ${data.action}`;
      actionBtn.onclick = () => {
        this.closeAdventModal();
        const starSection = document.getElementById('star-section');
        if (starSection) {
          starSection.scrollIntoView({ behavior: 'smooth' });
        }
      };
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }

  closeAdventModal() {
    const modal = document.getElementById('advent-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  }

  // Chuyển tuần trong Dõi theo ánh sao
  switchStarWeek(weekIndex) {
    this.currentStarWeek = weekIndex;

    // Cập nhật giao diện 4 tab tuần
    for (let i = 0; i < 4; i++) {
      const tab = document.getElementById(`star-week-tab-${i}`);
      if (tab) {
        if (i === weekIndex) {
          tab.className = `star-week-tab px-4 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-black border-2 border-amber-400 bg-amber-400 text-amber-950 shadow-md transition-all scale-105`;
        } else {
          tab.className = `star-week-tab px-4 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-black border-2 border-amber-200 bg-white text-slate-700 hover:bg-amber-100 transition-all`;
        }
      }
    }

    this.renderStarTasks(weekIndex);
  }

  // Render 3 nhiệm vụ của tuần được chọn
  renderStarTasks(weekIndex) {
    const weekData = this.starWeeksData[weekIndex];
    const container = document.getElementById('star-tasks-container');
    const headerTitle = document.getElementById('star-current-week-header');

    if (headerTitle) {
      const isWeekDone = this.completedStarTasks[weekIndex].every(Boolean);
      headerTitle.innerHTML = `
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-300 shadow-sm">
          <span class="text-xs uppercase font-black text-amber-900">
            Nhiệm Vụ ${weekData.weekTitle}
          </span>
          ${isWeekDone ? '<span class="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">✓ Hoàn Thành Tuần</span>' : ''}
        </div>
      `;
    }

    if (!container) return;

    let html = '';
    weekData.tasks.forEach((task, taskIdx) => {
      const isDone = this.completedStarTasks[weekIndex][taskIdx];
      const isCardTask = task.id === 'card';
      const key = `${weekIndex}_${taskIdx}`;
      const media = this.taskMedia[key];

      html += `
        <div id="star-task-card-${taskIdx}" onclick="window.faithJourney.handleStarTaskClick(${taskIdx}, event)" 
             class="m3-bright-card p-6 flex flex-col justify-between cursor-pointer transition-all duration-300 relative overflow-hidden bg-white ${isDone ? 'border-amber-500 bg-amber-50/70 shadow-lg' : 'hover:scale-[1.02]'}">
          
          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="text-4xl sm:text-5xl">${task.icon}</span>
              <div class="flex items-center gap-1.5">
                ${isDone 
                  ? '<span class="text-xs font-black px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">✓ ĐÃ LÀM</span>' 
                  : (isCardTask ? '<span class="text-xs font-black px-3 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">💌 CÓ POPUP</span>' : '<span class="text-xs font-black px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300">CHƯA LÀM</span>')}
              </div>
            </div>

            <div class="text-[11px] font-black uppercase tracking-wider text-amber-700 mb-1">
              Nhiệm Vụ ${taskIdx + 1}
            </div>
            
            <h3 class="text-lg sm:text-xl font-black text-slate-900 mb-2">
              ${task.title}
            </h3>

            <p class="text-xs sm:text-sm text-slate-600 font-bold mb-3 leading-relaxed">
              ${task.message}
            </p>

            ${media ? `
              <!-- Huy hiệu xem lại ảnh / video đã tải lên -->
              <div onclick="window.faithJourney.openMediaViewer(${weekIndex}, ${taskIdx}, event)" class="my-2 p-2.5 rounded-2xl bg-amber-100/90 hover:bg-amber-200 border border-amber-300 text-amber-950 text-xs font-black flex items-center justify-between cursor-pointer shadow-sm transition-transform hover:scale-[1.02]">
                <span class="truncate flex items-center gap-1.5">
                  <span class="text-base">${media.type === 'video' ? '🎬' : '📷'}</span>
                  <span class="truncate font-extrabold">${media.name}</span>
                </span>
                <span class="text-amber-800 font-black underline flex-shrink-0 ml-1.5">Xem lại 👁️</span>
              </div>
            ` : ''}
          </div>

          <div class="pt-4 border-t border-amber-100 mt-2">
            <button class="${isDone ? 'm3-kids-btn-tonal bg-emerald-100 text-emerald-900 border-emerald-300' : (isCardTask ? 'm3-kids-btn-primary' : 'm3-kids-btn-tonal')} w-full py-2.5 text-xs sm:text-sm font-black">
              ${isDone ? '✓ ĐÃ HOÀN THÀNH' : (isCardTask ? '✨ MỞ THIỆP & THÊM TÊN' : '👉 BẤM ĐỂ HOÀN THÀNH')}
            </button>
          </div>

        </div>
      `;
    });

    container.innerHTML = html;
    this.updateStarOfBethlehem();
  }

  // Xử lý khi bấm vào một nhiệm vụ
  handleStarTaskClick(taskIdx, event) {
    const weekData = this.starWeeksData[this.currentStarWeek];
    const task = weekData.tasks[taskIdx];

    // Nếu là nhiệm vụ Thiệp Giáng Sinh ở Tuần 4 -> mở popup Thiệp
    if (task.id === 'card') {
      this.openChristmasCardModal();
      return;
    }

    // Đánh dấu nhiệm vụ đã hoàn thành
    this.completedStarTasks[this.currentStarWeek][taskIdx] = true;

    if (window.sacredAudio) {
      window.sacredAudio.playChime('step');
    }

    if (window.celestialSky && event) {
      const rect = event.currentTarget.getBoundingClientRect();
      window.celestialSky.addStardustBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 30);
    }

    // Cập nhật lại danh sách nhiệm vụ của tuần
    this.renderStarTasks(this.currentStarWeek);

    // Hiển thị suy niệm nhiệm vụ nổi bật
    this.showTaskReflection(this.currentStarWeek, taskIdx);

    this.updateStarOfBethlehem();
    this.updateNativityPuzzleUI();
    this.updateProgressUI();
  }

  // Hiển thị khung suy niệm nhiệm vụ
  showTaskReflection(weekIndex, taskIndex) {
    const weekData = this.starWeeksData[weekIndex];
    const task = weekData.tasks[taskIndex];
    const banner = document.getElementById('star-reflection-banner');
    if (!banner) return;

    const key = `${weekIndex}_${taskIndex}`;
    const media = this.taskMedia[key];

    banner.innerHTML = `
      <div class="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border-3 border-amber-400 text-slate-800 shadow-xl animate-fade-in mt-6">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-3 text-amber-800 font-extrabold text-sm sm:text-base">
            <span class="text-3xl">${task.icon}</span>
            <span>${weekData.weekTitle.toUpperCase()} • ${task.title}</span>
          </div>
          ${media ? '<span class="text-xs font-black px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm animate-pulse">✓ ĐÃ CÓ ẢNH/VIDEO KỶ NIỆM</span>' : ''}
        </div>

        <p class="text-amber-950 font-black text-lg sm:text-xl mb-2">“${task.message}”</p>
        <p class="text-slate-700 font-bold text-sm sm:text-base mb-4 leading-relaxed">${task.reflection}</p>
        
        <div class="flex flex-wrap items-center gap-3">
          <div class="inline-flex items-center gap-2 text-xs sm:text-sm font-black px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-950 shadow-md">
            <span>🌟</span> ${task.actionText}
          </div>

          <!-- Nút Tải Ảnh / Video Kỷ Niệm -->
          <label class="cursor-pointer inline-flex items-center gap-2 text-xs sm:text-sm font-black px-5 py-2.5 rounded-full bg-white hover:bg-amber-100 text-amber-950 border-2 border-amber-400 shadow-md transition-all hover:scale-105 active:scale-95">
            <span>📸</span>
            <span>${media ? 'Đổi Ảnh / Video Khác' : 'Tải Ảnh / Video Kỷ Niệm'}</span>
            <input type="file" accept="image/*,video/*" class="hidden" onchange="window.faithJourney.handleTaskMediaUpload(${weekIndex}, ${taskIndex}, event)">
          </label>
        </div>

        <!-- Khung Xem Lại Hình Ảnh / Video Đã Tải Lên Theo Nhiệm Vụ Này -->
        ${media ? `
          <div class="mt-6 p-4 sm:p-5 rounded-2xl bg-white/95 border-2 border-amber-300 shadow-lg flex flex-col sm:flex-row items-center gap-5">
            <!-- Thumbnail / Video Preview -->
            <div onclick="window.faithJourney.openMediaViewer(${weekIndex}, ${taskIndex}, event)" class="relative w-full sm:w-56 h-40 rounded-xl overflow-hidden bg-slate-900 border-2 border-amber-400 cursor-pointer group flex-shrink-0 shadow-md">
              ${media.type === 'video' 
                ? `<video src="${media.dataUrl}" class="w-full h-full object-cover"></video>
                   <div class="absolute inset-0 bg-black/40 flex items-center justify-center text-4xl text-white group-hover:scale-110 transition-transform">▶️</div>`
                : `<img src="${media.dataUrl}" alt="${media.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform">
                   <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity">🔍 Bấm để xem phóng to</div>`
              }
            </div>

            <!-- Chi tiết & Nút Xem Lại -->
            <div class="flex-1 w-full text-left">
              <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase mb-1.5 border border-amber-300">
                <span>${media.type === 'video' ? '🎬 Video Kỷ Niệm' : '🖼️ Hình Ảnh Kỷ Niệm'}</span>
              </div>
              <h4 class="text-sm sm:text-base font-black text-slate-900 truncate mb-1">${media.name}</h4>
              <p class="text-xs text-slate-500 font-bold mb-3">Tải lên: ${media.uploadedAt} • Dung lượng: ${media.size}</p>
              
              <div class="flex flex-wrap gap-2.5">
                <button onclick="window.faithJourney.openMediaViewer(${weekIndex}, ${taskIndex}, event)" class="px-4 py-2 rounded-full bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs shadow-md transition-transform hover:scale-105 flex items-center gap-1.5">
                  <span>👁️</span> <span>Xem Lại Phóng To</span>
                </button>
                <button onclick="window.faithJourney.deleteTaskMedia(${weekIndex}, ${taskIndex}, event)" class="px-3.5 py-2 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 font-black text-xs border border-rose-300 shadow-sm transition-transform hover:scale-105 flex items-center gap-1">
                  <span>🗑️</span> <span>Xóa</span>
                </button>
              </div>
            </div>
          </div>
        ` : `
          <div class="mt-4 p-3.5 rounded-xl bg-amber-100/60 border border-dashed border-amber-300 text-xs text-amber-900 font-bold flex items-center gap-2">
            <span>💡</span>
            <span>Bé có thể nhấn nút <strong>"Tải Ảnh / Video Kỷ Niệm"</strong> ở trên để lưu lại khoảnh khắc đẹp khi hoàn thành nhiệm vụ này và xem lại bất cứ lúc nào!</span>
          </div>
        `}
      </div>
    `;
    banner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Cập nhật độ sáng Ngôi Sao Bêlem
  updateStarOfBethlehem() {
    let completedCount = 0;
    for (let w = 0; w < 4; w++) {
      completedCount += this.completedStarTasks[w].filter(Boolean).length;
    }

    const totalTasks = 12; // 4 tuần x 3 nhiệm vụ
    const starGlow = document.getElementById('journey-star-glow');
    const starCore = document.getElementById('journey-star-core');
    const progressPath = document.getElementById('star-progress-path');

    if (progressPath) {
      const percentage = (completedCount / totalTasks) * 100;
      progressPath.style.width = `${percentage}%`;
    }

    if (starGlow && starCore) {
      const scale = 1 + completedCount * 0.08;
      const opacity = 0.5 + (completedCount / totalTasks) * 0.5;
      starCore.style.transform = `scale(${scale})`;
      starGlow.style.opacity = `${opacity}`;
    }

    // Nếu hoàn thành toàn bộ 12 nhiệm vụ của 4 tuần
    const completionNotice = document.getElementById('star-completed-celebration');
    if (completionNotice) {
      if (completedCount === totalTasks) {
        completionNotice.classList.remove('hidden');
        if (window.sacredAudio) {
          window.sacredAudio.playChime('blessing');
        }
      }
    }
  }

  // --- POPUP THIỆP GIÁNG SINH (Tuần 4) ---

  openChristmasCardModal() {
    const modal = document.getElementById('christmas-card-modal');
    if (!modal) return;

    if (window.sacredAudio) {
      window.sacredAudio.playChime('blessing');
    }

    const input = document.getElementById('card-recipient-input');
    if (input) {
      input.value = this.cardRecipientName;
    }
    this.updateCardRecipient(this.cardRecipientName);

    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }

  closeChristmasCardModal() {
    const modal = document.getElementById('christmas-card-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  }

  updateCardRecipient(name) {
    this.cardRecipientName = name.trim() || 'Gia Đình Thân Yêu';
    const preview = document.getElementById('card-preview-name');
    if (preview) {
      preview.textContent = this.cardRecipientName;
    }
  }

  saveChristmasCard() {
    // Đánh dấu nhiệm vụ Thiệp Giáng Sinh ở Tuần 4 (week index 3, task index 2) đã hoàn thành
    this.completedStarTasks[3][2] = true;

    if (window.sacredAudio) {
      window.sacredAudio.playChime('blessing');
    }

    if (window.celestialSky) {
      window.celestialSky.addStardustBurst(window.innerWidth / 2, window.innerHeight / 2, 60);
    }

    this.closeChristmasCardModal();
    this.renderStarTasks(this.currentStarWeek);
    this.showTaskReflection(3, 2);
    this.updateStarOfBethlehem();
    this.updateNativityPuzzleUI();
    this.updateProgressUI();
  }

  printChristmasCard() {
    window.print();
  }

  // --- BỨC TRANH GHÉP 4 MẢNH HANG ĐÁ BÊLEM ---

  jumpToStarWeek(weekIndex) {
    this.switchStarWeek(weekIndex);
    const starSection = document.getElementById('star-section');
    if (starSection) {
      starSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  jumpToAdventCandle(index) {
    const candleSection = document.getElementById('advent-section');
    if (candleSection) {
      candleSection.scrollIntoView({ behavior: 'smooth' });
    }
    setTimeout(() => {
      const candle = document.getElementById(`advent-candle-${index}`);
      if (candle) {
        candle.click();
      }
    }, 500);
  }

  isWeekCompleted(weekIndex) {
    const tasks = this.completedStarTasks[weekIndex];
    return Array.isArray(tasks) && tasks.length === 3 && tasks.every(Boolean);
  }

  showScriptureWithTimer(durationMs = 10000) {
    if (this.scriptureDismissTimer) {
      clearTimeout(this.scriptureDismissTimer);
      this.scriptureDismissTimer = null;
    }
    const card = document.getElementById('scripture-verse-card');
    const toggleText = document.getElementById('scripture-toggle-text');
    const toggleIcon = document.getElementById('scripture-toggle-icon');

    if (card) {
      card.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
    }
    if (toggleText) toggleText.textContent = 'Ẩn Lời Chúa';
    if (toggleIcon) toggleIcon.textContent = '👁️';

    this.scriptureDismissTimer = setTimeout(() => {
      if (card) {
        card.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
      }
      if (toggleText) toggleText.textContent = 'Hiện Lời Chúa';
      if (toggleIcon) toggleIcon.textContent = '📖';
    }, durationMs);
  }

  toggleScriptureOverlay() {
    if (this.scriptureDismissTimer) {
      clearTimeout(this.scriptureDismissTimer);
      this.scriptureDismissTimer = null;
    }
    const card = document.getElementById('scripture-verse-card');
    const toggleText = document.getElementById('scripture-toggle-text');
    const toggleIcon = document.getElementById('scripture-toggle-icon');
    if (card) {
      if (card.classList.contains('opacity-0')) {
        card.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
        if (toggleText) toggleText.textContent = 'Ẩn Lời Chúa';
        if (toggleIcon) toggleIcon.textContent = '👁️';
      } else {
        card.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
        if (toggleText) toggleText.textContent = 'Hiện Lời Chúa';
        if (toggleIcon) toggleIcon.textContent = '📖';
      }
    }
  }

  updateNativityPuzzleUI() {
    let completedWeeksCount = 0;
    for (let i = 0; i < 4; i++) {
      const isCompleted = this.isWeekCompleted(i);
      if (isCompleted) {
        completedWeeksCount++;
        // Tự động thắp sáng ngọn nến Mùa Vọng tương ứng nếu chưa thắp
        this.milestones.advent[i] = true;
        const candleEl = document.getElementById(`advent-candle-${i}`);
        if (candleEl) {
          const flame = candleEl.querySelector('.candle-flame');
          const aura = candleEl.querySelector('.candle-aura');
          const statusPill = candleEl.querySelector('.candle-status');
          if (flame) flame.classList.remove('opacity-0', 'scale-0');
          if (aura) aura.classList.remove('opacity-0');
          if (statusPill) {
            statusPill.innerHTML = '<span class="text-amber-600 font-extrabold">✨ Đã Thắp Sáng</span>';
          }
        }
      }

      const overlay = document.getElementById(`puzzle-overlay-${i}`);
      const badge = document.getElementById(`puzzle-badge-${i}`);
      const slot = document.getElementById(`puzzle-slot-${i}`);
      const progressEl = document.getElementById(`puzzle-task-progress-${i}`);
      const statusEl = document.getElementById(`puzzle-task-status-${i}`);

      const doneTasks = (this.completedStarTasks[i] || []).filter(Boolean).length;

      if (progressEl) {
        progressEl.textContent = `Tiến độ: ${doneTasks}/3 nhiệm vụ`;
      }
      if (statusEl) {
        if (doneTasks === 0) {
          statusEl.textContent = `👉 Chạm để làm 3 nhiệm vụ ${this.starWeeksData[i]?.weekName || ('Tuần ' + (i + 1))} & mở bừng mảnh ghép!`;
        } else if (doneTasks < 3) {
          statusEl.textContent = `👉 Đã làm ${doneTasks}/3 nhiệm vụ, hãy hoàn thành nốt để mở mảnh ghép!`;
        } else {
          statusEl.textContent = '✨ Đã hoàn thành cả 3 nhiệm vụ!';
        }
      }

      if (overlay) {
        if (isCompleted) {
          overlay.classList.add('opacity-0', 'pointer-events-none', 'scale-105');
          overlay.classList.remove('opacity-100');
        } else {
          overlay.classList.remove('opacity-0', 'pointer-events-none', 'scale-105');
          overlay.classList.add('opacity-100');
        }
      }

      if (badge) {
        if (isCompleted && completedWeeksCount < 4) {
          badge.classList.remove('hidden');
        } else {
          badge.classList.add('hidden');
        }
      }

      if (slot) {
        if (isCompleted) {
          slot.classList.add('puzzle-piece-lit');
        } else {
          slot.classList.remove('puzzle-piece-lit');
        }
      }
    }

    const gridOverlay = document.getElementById('puzzle-grid-overlay');
    const centerNode = document.getElementById('puzzle-center-node');
    const completeScriptureContainer = document.getElementById('puzzle-complete-scripture-container');
    const fullCelebration = document.getElementById('puzzle-full-celebration');

    if (completedWeeksCount === 4) {
      // ẨN HOÀN TOÀN CÁC VIỀN GHÉP VÀ NÚT TÂM ĐỂ BỨC TRANH NGUYÊN VẸN 100%
      if (gridOverlay) {
        gridOverlay.classList.add('opacity-0', 'pointer-events-none');
        gridOverlay.classList.remove('opacity-100');
      }
      if (centerNode) {
        centerNode.classList.add('hidden', 'opacity-0');
      }
      // HIỆN CÂU LỜI CHÚA VÀ KHUNG TRANH NGUYÊN VẸN
      if (completeScriptureContainer) {
        completeScriptureContainer.classList.remove('hidden');
        setTimeout(() => {
          completeScriptureContainer.classList.remove('opacity-0');
          completeScriptureContainer.classList.add('opacity-100');
        }, 50);
      }
      if (fullCelebration) {
        fullCelebration.classList.remove('hidden');
      }

      // Hiện Lời Chúa khoảng 10 giây sau đó tự động ẩn đi để chiêm ngắm tranh nguyên vẹn
      this.showScriptureWithTimer(10000);

      if (!this.puzzleAllCelebrated) {
        this.puzzleAllCelebrated = true;
        if (window.sacredAudio) {
          window.sacredAudio.playGrandGloria();
        }
        if (window.celestialSky) {
          window.celestialSky.addStardustBurst(window.innerWidth / 2, window.innerHeight * 0.7, 70);
        }
      }
    } else {
      // ĐANG TRONG QUÁ TRÌNH GHÉP 4 MẢNH
      this.puzzleAllCelebrated = false;
      if (this.scriptureDismissTimer) {
        clearTimeout(this.scriptureDismissTimer);
        this.scriptureDismissTimer = null;
      }
      if (gridOverlay) {
        gridOverlay.classList.remove('opacity-0', 'pointer-events-none');
        gridOverlay.classList.add('opacity-100');
      }
      if (centerNode) {
        centerNode.classList.remove('hidden', 'opacity-0');
        centerNode.innerHTML = `
          <div class="px-4 py-1.5 rounded-full bg-slate-900/90 text-amber-300 font-extrabold text-xs border border-amber-400/80 shadow-md backdrop-blur-sm whitespace-nowrap flex items-center gap-1">
            <span>🧩</span> Mảnh ghép Hang Đá: <strong>${completedWeeksCount}/4</strong> tuần đã xong
          </div>
        `;
      }
      if (completeScriptureContainer) {
        completeScriptureContainer.classList.add('opacity-0', 'hidden');
        completeScriptureContainer.classList.remove('opacity-100');
      }
      if (fullCelebration) {
        fullCelebration.classList.add('hidden');
      }
    }
  }

  // --- LÁ THƯ GỬI CHÚA HÀI ĐỒNG ---

  sendLetter(event) {
    this.milestones.letterOffered = true;

    if (window.sacredAudio) {
      window.sacredAudio.playChime('blessing');
    }

    const parchment = document.getElementById('parchment-letter-wrapper');
    if (parchment) {
      parchment.style.transition = 'all 1.6s cubic-bezier(0.2, 0.8, 0.2, 1)';
      parchment.style.transform = 'translateY(-100px) scale(0.9)';
      parchment.style.opacity = '0';
      parchment.style.filter = 'blur(6px) brightness(1.3)';
    }

    if (window.celestialSky && event) {
      window.celestialSky.addStardustBurst(window.innerWidth / 2, window.innerHeight * 0.5, 50);
    }

    setTimeout(() => {
      const container = document.getElementById('letter-sent-container');
      if (container) {
        container.classList.remove('hidden');
        container.innerHTML = `
          <div class="p-8 rounded-3xl bg-gradient-to-b from-amber-50 via-white to-sky-50 border-3 border-amber-400 text-center max-w-2xl mx-auto animate-fade-in shadow-2xl">
            <div class="text-5xl mb-4 animate-bounce">🕊️ 💌 ❤️</div>
            <h3 class="text-3xl text-amber-800 font-black mb-3">Lá Thư Của Con Đã Được Trao Vào Tay Chúa</h3>
            <p class="text-xl font-black text-slate-800 mb-6 leading-relaxed">
              “Con không phải gánh vác mọi sự một mình.<br/>Hãy đặt trọn trái tim bé nhỏ vào đôi tay Chúa.”
            </p>
            <p class="text-slate-700 font-bold text-base mb-6 leading-relaxed">
              Chúa Giêsu đã đọc từng dòng chữ chân thành của con. Người mỉm cười chúc lành và ôm lấy con trong tình yêu dịu êm của Ngài.
            </p>
            <button onclick="window.faithJourney.resetLetter()" class="m3-kids-btn-tonal text-xs font-black">
              ✍️ Viết Thư Mới Cho Chúa
            </button>
          </div>
        `;
      }
    }, 1200);

    this.updateProgressUI();
  }

  resetLetter() {
    const parchment = document.getElementById('parchment-letter-wrapper');
    const container = document.getElementById('letter-sent-container');
    if (parchment) {
      parchment.style.transform = 'none';
      parchment.style.opacity = '1';
      parchment.style.filter = 'none';
    }
    if (container) {
      container.classList.add('hidden');
    }
  }

  // --- HANG ĐÁ BÊLEM & CHÚC LÀNH ---

  keepTheLight(event) {
    this.milestones.nativityAdored = true;
    this.updateProgressUI();

    if (window.sacredAudio) {
      window.sacredAudio.playGrandGloria();
    }

    if (window.celestialSky && event) {
      window.celestialSky.addStardustBurst(window.innerWidth / 2, window.innerHeight / 2, 80);
    }

    const veil = document.getElementById('golden-climax-veil');
    const modal = document.getElementById('climax-modal');

    if (veil) {
      veil.classList.add('active');
    }

    setTimeout(() => {
      if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
      }
    }, 1400);
  }

  dismissClimax() {
    const veil = document.getElementById('golden-climax-veil');
    const modal = document.getElementById('climax-modal');
    if (veil) veil.classList.remove('active');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  }

  // Cập nhật thanh tiến trình hành trình
  updateProgressUI() {
    let score = 0;
    if (this.milestones.hero) score += 10;
    
    // Nến Mùa Vọng (4 nến x 5% = 20%)
    const litAdvent = this.milestones.advent.filter(Boolean).length;
    score += litAdvent * 5;

    // 12 nhiệm vụ Dõi Theo Ánh Sao (4 tuần x 3 nhiệm vụ) = max 45%
    let completedStarCount = 0;
    for (let w = 0; w < 4; w++) {
      completedStarCount += this.completedStarTasks[w].filter(Boolean).length;
    }
    score += Math.round((completedStarCount / 12) * 45);

    if (this.milestones.letterOffered) score += 15;
    if (this.milestones.nativityAdored) score += 10;
    if (this.milestones.dailyPrayer) score += 5;

    score = Math.min(100, Math.round(score));

    const bar = document.getElementById('global-progress-bar');
    const pill = document.getElementById('global-progress-pill');

    if (bar) bar.style.width = `${score}%`;
    if (pill) {
      if (score === 100) {
        pill.innerHTML = `✨ <strong>Tràn Đầy Ơn Chúa (100%)</strong>`;
      } else {
        pill.innerHTML = `<span>⭐ Hành Trình: <strong>${score}%</strong></span>`;
      }
    }
  }

  // ==========================================
  // QUẢN LÝ BẢNG LỜI CẦU NGUYỆN HẰNG NGÀY & TĨNH TÂM 10S
  // ==========================================

  // Quản lý kích hoạt Bảng Lời Nguyện:
  // 1. Tự động hiển thị ở lần đăng nhập / mở trang đầu tiên
  // 2. Tự động hiển thị đúng 19 giờ 20 phút tối mỗi ngày
  // 3. Cho phép xem lại bất cứ lúc nào trong phần nhiệm vụ hàng ngày
  initPrayerTriggers() {
    // A. KÍCH HOẠT LẦN ĐĂNG NHẬP / MỞ TRANG ĐẦU TIÊN
    const hasSeenFirstLoginPrayer = sessionStorage.getItem('christmas_first_login_prayer');
    if (!hasSeenFirstLoginPrayer) {
      sessionStorage.setItem('christmas_first_login_prayer', 'true');
      // Tự động mở bảng lời nguyện sau 1.2s khi vào trang web
      setTimeout(() => {
        if (!this.isPrayerModalOpen) {
          this.openPrayerModal();
        }
      }, 1200);
    }

    // B. LÊN LỊCH TỰ ĐỘNG XUẤT HIỆN ĐÚNG 19 GIỜ 20 PHÚT TỐI
    this.schedule1920EveningPrayer();

    // C. Theo dõi tương tác người dùng (kích hoạt nếu lần đầu click)
    document.addEventListener('click', (e) => {
      // Bỏ qua click bên trong chính prayer modal hoặc các nút mở modal
      if (e.target.closest('#sacred-prayer-modal') || e.target.closest('[onclick*="openPrayerModal"]')) {
        return;
      }

      this.prayerClickCount++;

      // Đảm bảo lần đăng nhập đầu tiên nếu trình duyệt chặn autoplay/delay thì click đầu tiên sẽ mở
      if (!sessionStorage.getItem('christmas_first_click_prayer_shown')) {
        sessionStorage.setItem('christmas_first_click_prayer_shown', 'true');
        if (!this.isPrayerModalOpen) {
          this.openPrayerModal();
        }
      }
    });
  }

  // Bộ kiểm tra thời gian chuẩn xác đến từng giây cho mốc 19:20 tối
  schedule1920EveningPrayer() {
    if (this.scheduledPrayerCheckInterval) {
      clearInterval(this.scheduledPrayerCheckInterval);
    }

    const checkTime = () => {
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes();
      const dateKey = now.toDateString();

      // So sánh với giờ và phút đã cài đặt trong this.prayerScheduleConfig
      const targetHour = this.prayerScheduleConfig?.hour ?? 19;
      const targetMinute = this.prayerScheduleConfig?.minute ?? 20;

      if (h === targetHour && m === targetMinute) {
        if (this.lastTriggered1920Date !== dateKey) {
          this.lastTriggered1920Date = dateKey;
          // Chọn bài Lời cầu nguyện phù hợp
          this.openPrayerModal(this.currentPrayerIndex);
        }
      }
    };

    // Kiểm tra ngay lúc vừa load
    checkTime();
    // Kiểm tra định kỳ mỗi giây để đảm bảo bật ngay thời khắc 19:20:00
    this.scheduledPrayerCheckInterval = setInterval(checkTime, 1000);
  }

  // Mở Bảng Lời Cầu Nguyện
  openPrayerModal(prayerIdx) {
    if (prayerIdx !== undefined && prayerIdx >= 0 && prayerIdx < this.dailyPrayers.length) {
      this.currentPrayerIndex = prayerIdx;
    }

    const prayer = this.dailyPrayers[this.currentPrayerIndex];
    const modal = document.getElementById('sacred-prayer-modal');
    const card = document.getElementById('sacred-prayer-card');
    const titleEl = document.getElementById('prayer-modal-title');
    const contentEl = document.getElementById('prayer-modal-content');
    const btn = document.getElementById('prayer-silence-btn');
    const btnText = document.getElementById('prayer-btn-text');

    if (!modal) return;

    if (titleEl) titleEl.textContent = prayer.periodName;
    if (contentEl) contentEl.textContent = prayer.content;

    this.isPrayerModalOpen = true;
    modal.classList.remove('hidden');
    modal.classList.add('flex');

    setTimeout(() => {
      if (card) {
        card.classList.remove('scale-95', 'opacity-0');
        card.classList.add('scale-100', 'opacity-100');
      }
    }, 15);

    if (window.sacredAudio) {
      window.sacredAudio.playChime('prayer');
    }

    // Khởi động đếm ngược 10s Thinh Lặng
    if (this.prayerCountdownInterval) {
      clearInterval(this.prayerCountdownInterval);
    }
    this.prayerSecondsLeft = 10;
    if (btnText) btnText.textContent = `Thinh lặng ${this.prayerSecondsLeft}s`;
    if (btn) {
      btn.className = "w-full py-2.5 px-4 rounded-xl border border-amber-300 hover:border-amber-400 bg-white hover:bg-amber-50/80 text-amber-700 font-bold text-sm sm:text-base transition-all duration-200 shadow-sm flex items-center justify-center gap-2";
    }

    this.prayerCountdownInterval = setInterval(() => {
      this.prayerSecondsLeft--;
      if (this.prayerSecondsLeft > 0) {
        if (btnText) btnText.textContent = `Thinh lặng ${this.prayerSecondsLeft}s`;
      } else {
        clearInterval(this.prayerCountdownInterval);
        this.prayerCountdownInterval = null;
        this.completeDailyPrayer();
      }
    }, 1000);
  }

  // Xử lý khi nhấn nút Thinh Lặng
  handlePrayerButtonClick() {
    if (this.prayerSecondsLeft > 0) {
      // Nếu đang đếm ngược và người dùng nhấn: hoàn tất thinh lặng ngay
      if (this.prayerCountdownInterval) {
        clearInterval(this.prayerCountdownInterval);
        this.prayerCountdownInterval = null;
      }
      this.completeDailyPrayer();
    } else {
      // Đã xong 10s: nhấn để đóng
      this.closePrayerModal();
    }
  }

  // Hoàn thành giờ cầu nguyện tĩnh tâm
  completeDailyPrayer() {
    this.prayerSecondsLeft = 0;
    this.hasCompletedDailyPrayer = true;
    this.milestones.dailyPrayer = true;

    const btn = document.getElementById('prayer-silence-btn');
    const btnText = document.getElementById('prayer-btn-text');
    const status = document.getElementById('prayer-modal-status');

    if (btnText) {
      btnText.innerHTML = `<span>A-men 🙏 (Hoàn thành)</span>`;
    }
    if (btn) {
      btn.className = "w-full py-2.5 px-4 rounded-xl border-2 border-emerald-400 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-black text-sm sm:text-base transition-all duration-200 shadow-sm flex items-center justify-center gap-2";
    }
    if (status) {
      status.innerHTML = `<span class="text-emerald-700 font-black">✓ Đã tĩnh tâm</span>`;
    }

    if (window.sacredAudio) {
      window.sacredAudio.playChime('blessing');
    }

    this.updateDailyPrayerTaskCard();
    this.updateProgressUI();
  }

  // Đóng Bảng Lời Nguyện
  closePrayerModal() {
    if (this.prayerCountdownInterval) {
      clearInterval(this.prayerCountdownInterval);
      this.prayerCountdownInterval = null;
    }

    const modal = document.getElementById('sacred-prayer-modal');
    const card = document.getElementById('sacred-prayer-card');

    if (card) {
      card.classList.remove('scale-100', 'opacity-100');
      card.classList.add('scale-95', 'opacity-0');
    }

    setTimeout(() => {
      if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
      }
      this.isPrayerModalOpen = false;
      this.lastPrayerClosedTime = Date.now();
    }, 200);

    this.updateDailyPrayerTaskCard();
  }

  // Chuyển sang lời cầu nguyện khác
  switchNextPrayer(event) {
    if (event) event.stopPropagation();
    this.currentPrayerIndex = (this.currentPrayerIndex + 1) % this.dailyPrayers.length;
    const prayer = this.dailyPrayers[this.currentPrayerIndex];

    const titleEl = document.getElementById('prayer-modal-title');
    const contentEl = document.getElementById('prayer-modal-content');
    if (titleEl) titleEl.textContent = prayer.periodName;
    if (contentEl) contentEl.textContent = prayer.content;

    // Khởi động lại đếm ngược nếu bảng đang mở
    if (this.isPrayerModalOpen) {
      if (this.prayerCountdownInterval) {
        clearInterval(this.prayerCountdownInterval);
      }
      this.prayerSecondsLeft = 10;
      const btnText = document.getElementById('prayer-btn-text');
      const btn = document.getElementById('prayer-silence-btn');
      if (btnText) btnText.textContent = `Thinh lặng ${this.prayerSecondsLeft}s`;
      if (btn) {
        btn.className = "w-full py-2.5 px-4 rounded-xl border border-amber-300 hover:border-amber-400 bg-white hover:bg-amber-50/80 text-amber-700 font-bold text-sm sm:text-base transition-all duration-200 shadow-sm flex items-center justify-center gap-2";
      }

      this.prayerCountdownInterval = setInterval(() => {
        this.prayerSecondsLeft--;
        if (this.prayerSecondsLeft > 0) {
          if (btnText) btnText.textContent = `Thinh lặng ${this.prayerSecondsLeft}s`;
        } else {
          clearInterval(this.prayerCountdownInterval);
          this.prayerCountdownInterval = null;
          this.completeDailyPrayer();
        }
      }, 1000);
    }

    this.updateDailyPrayerTaskCard();
  }

  // Cập nhật giao diện khung Lời Cầu Nguyện trong phần Nhiệm Vụ Hằng Ngày
  updateDailyPrayerTaskCard() {
    const prayer = this.dailyPrayers[this.currentPrayerIndex];
    const titleEl = document.getElementById('daily-prayer-task-title');
    const excerptEl = document.getElementById('daily-prayer-task-excerpt');
    const badgeEl = document.getElementById('daily-prayer-badge');

    if (titleEl && prayer) titleEl.textContent = prayer.periodName;
    if (excerptEl && prayer) excerptEl.textContent = prayer.content;

    if (badgeEl) {
      if (this.hasCompletedDailyPrayer) {
        badgeEl.className = "text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300";
        badgeEl.textContent = "✓ Đã Cầu Nguyện Hôm Nay";
      } else {
        badgeEl.className = "text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300";
        badgeEl.textContent = "⏳ Thinh Lặng 10s";
      }
    }
  }
}

window.faithJourney = new FaithJourney();
