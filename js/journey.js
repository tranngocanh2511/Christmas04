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
 * KHO DỮ LIỆU 20 LỜI NGUYỆN CÔNG GIÁO THIẾU NHI MỖI NGÀY
 * Trích xuất nguyên bản từ '20 lời nguyện.docx'
 */
const SACRED_PRAYERS_REPOSITORY = [
  {
    id: 1,
    dayNum: 1,
    period: 'morning',
    periodName: 'Lời nguyện Ngày 1: Tạ Ơn Tình Yêu Chúa',
    theme: 'Tạ Ơn & Yêu Thương',
    themeBadge: 'bg-amber-100 text-amber-900 border-amber-300',
    content: 'Lạy Chúa, con tạ ơn Chúa vì đã luôn yêu thương và gìn giữ con từng phút giây. Xin cho con luôn nhớ rằng mình là một đứa con bé bỏng luôn được Chúa cưng chiều và bảo vệ.',
    subtext: 'Con bé bỏng luôn được Chúa cưng chiều'
  },
  {
    id: 2,
    dayNum: 2,
    period: 'evening',
    periodName: 'Lời nguyện Ngày 2: Xin Nắm Lấy Tay Con',
    theme: 'Ăn Năn & Cậy Trông',
    themeBadge: 'bg-blue-100 text-blue-900 border-blue-300',
    content: 'Chúa ơi, nhiều lúc con ham chơi mà quên mất Chúa đang ở bên cạnh chờ đợi con. Xin tha lỗi cho con và xin nắm lấy tay con, dẫn con đi trong tình yêu êm ái của Ngài.',
    subtext: 'Xin dẫn con đi trong tình yêu êm ái'
  },
  {
    id: 3,
    dayNum: 3,
    period: 'morning',
    periodName: 'Lời nguyện Ngày 3: Trái Tim Hiền Hậu',
    theme: 'Noi Gương Chúa Giêsu',
    themeBadge: 'bg-rose-100 text-rose-900 border-rose-300',
    content: 'Lạy Chúa Giêsu, xin biến đổi trái tim bé nhỏ của con nên giống trái tim hiền hậu của Chúa. Xin dạy con biết yêu thương mọi người như chính Chúa đã yêu thương con.',
    subtext: 'Yêu thương mọi người như chính Chúa yêu con'
  },
  {
    id: 4,
    dayNum: 4,
    period: 'evening',
    periodName: 'Lời nguyện Ngày 4: Lắng Đọng Tâm Hồn',
    theme: 'Tĩnh Tâm & Gặp Gỡ',
    themeBadge: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    content: 'Chúa ơi, thế giới ồn ào nhiều lúc làm con xao lãng, chẳng nhớ nâng tâm hồn lên cùng Ngài. Xin Chúa nhẹ nhàng gõ cửa trái tim, để con luôn biết dành cho Chúa một vị trí trọn vẹn nhất.',
    subtext: 'Dành cho Chúa vị trí trọn vẹn nhất'
  },
  {
    id: 5,
    dayNum: 5,
    period: 'noon',
    periodName: 'Lời nguyện Ngày 5: Tâm Hồn Đơn Sơ',
    theme: 'Biết Ơn Hồng Ân',
    themeBadge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    content: 'Lạy Chúa, con tạ ơn Ngài vì biết bao ơn lành vô hình mà Ngài vẫn âm thầm tuôn đổ trên con mỗi ngày. Xin cho con một tâm hồn đơn sơ để luôn biết rung động và biết ơn tình yêu bao la ấy.',
    subtext: 'Rung động trước ơn lành âm thầm của Chúa'
  },
  {
    id: 6,
    dayNum: 6,
    period: 'evening',
    periodName: 'Lời nguyện Ngày 6: Vòng Tay Yêu Thương Của Chúa',
    theme: 'Bao Dung & Tha Thứ',
    themeBadge: 'bg-amber-100 text-amber-900 border-amber-300',
    content: 'Những lúc con làm sai hoặc vấp ngã, lạy Chúa, xin đừng để con sợ hãi trốn tránh Ngài. Xin cho con vững tin rằng vòng tay Chúa luôn rộng mở chờ đón con quay về.',
    subtext: 'Vòng tay Chúa luôn rộng mở đón con'
  },
  {
    id: 7,
    dayNum: 7,
    period: 'morning',
    periodName: 'Lời nguyện Ngày 7: Nụ Cười Lạc Quan Bình An',
    theme: 'Niềm Vui Đức Tin',
    themeBadge: 'bg-yellow-100 text-yellow-900 border-yellow-300',
    content: 'Chúa ơi, xin dạy con biết mỉm cười thật tươi dù hôm nay có chuyện gì xảy ra đi nữa. Vì con biết rằng, chỉ cần có Chúa ở cùng, mọi sự rồi sẽ bình an.',
    subtext: 'Chỉ cần có Chúa ở cùng, mọi sự sẽ bình an'
  },
  {
    id: 8,
    dayNum: 8,
    period: 'morning',
    periodName: 'Lời nguyện Ngày 8: Ngọn Lửa Chúa Thánh Thần',
    theme: 'Ơn Chúa Thánh Thần',
    themeBadge: 'bg-red-100 text-red-900 border-red-300',
    content: 'Lạy Chúa Thánh Thần, xin thắp sáng ngọn lửa yêu mến trong tâm hồn bé nhỏ của con. Xin soi đường chỉ lối để con luôn biết làm những điều hiền lành, thánh thiện đẹp lòng Chúa.',
    subtext: 'Soi đường chỉ lối làm điều thánh thiện'
  },
  {
    id: 9,
    dayNum: 9,
    period: 'noon',
    periodName: 'Lời nguyện Ngày 9: Thêm Sức Vững Bước',
    theme: 'Sức Mạnh Khi Yếu Đuối',
    themeBadge: 'bg-purple-100 text-purple-900 border-purple-300',
    content: 'Lạy Chúa, đôi khi con cảm thấy mình thật nhỏ bé và yếu đuối trước những khó khăn. Xin Chúa ôm con vào lòng, truyền thêm sức mạnh để con vững bước mỗi ngày.',
    subtext: 'Xin Chúa ôm con và truyền thêm sức mạnh'
  },
  {
    id: 10,
    dayNum: 10,
    period: 'noon',
    periodName: 'Lời nguyện Ngày 10: Người Bạn Tri Kỷ Giêsu',
    theme: 'Tình Bạn Với Chúa',
    themeBadge: 'bg-sky-100 text-sky-900 border-sky-300',
    content: 'Chúa Giêsu ơi, xin làm người bạn thân thiết nhất của con trong suốt cuộc đời này. Xin cho con biết chia sẻ mọi tâm tư cùng Chúa như thầm thĩ với một người bạn tri kỷ.',
    subtext: 'Chúa Giêsu - Người bạn thân thiết nhất'
  },
  {
    id: 11,
    dayNum: 11,
    period: 'evening',
    periodName: 'Lời nguyện Ngày 11: Gieo Rắc Sự Bình An',
    theme: 'Hòa Giải & Nhẫn Nại',
    themeBadge: 'bg-teal-100 text-teal-900 border-teal-300',
    content: 'Lạy Chúa, con xin lỗi vì những lúc con nóng nảy hoặc vô tình làm người khác buồn lòng. Xin Chúa uốn nắn suy nghĩ và hành động của con, để con chỉ gieo rắc sự bình an của Chúa.',
    subtext: 'Chỉ gieo rắc sự bình an của Chúa'
  },
  {
    id: 12,
    dayNum: 12,
    period: 'morning',
    periodName: 'Lời nguyện Ngày 12: Đôi Mắt Sáng Của Đức Tin',
    theme: 'Đức Tin Trong Đời Sống',
    themeBadge: 'bg-amber-100 text-amber-900 border-amber-300',
    content: 'Xin Chúa cho con đôi mắt sáng của đức tin, để con nhìn thấy Chúa đang mỉm cười với con qua từng điều nhỏ bé quanh mình. Con tạ ơn Chúa vì đã cho con vinh dự làm con của Ngài.',
    subtext: 'Nhìn thấy Chúa mỉm cười qua từng điều nhỏ bé'
  },
  {
    id: 13,
    dayNum: 13,
    period: 'noon',
    periodName: 'Lời nguyện Ngày 13: Trái Tim Ngoan Ngoãn & Bác Ái',
    theme: 'Thanh Tẩy Tâm Hồn',
    themeBadge: 'bg-pink-100 text-pink-900 border-pink-300',
    content: 'Lạy Chúa, xin thanh tẩy tâm hồn con khỏi những suy nghĩ ích kỷ hay hờn ghen. Xin lấp đầy lòng con bằng tình yêu vô điều kiện của Chúa, để con sống dễ thương và ngoan ngoãn hơn.',
    subtext: 'Lấp đầy lòng con bằng tình yêu vô điều kiện'
  },
  {
    id: 14,
    dayNum: 14,
    period: 'morning',
    periodName: 'Lời nguyện Ngày 14: Nhịp Đập Tôn Vinh Chúa',
    theme: 'Ngợi Khen & Tạ Ơn',
    themeBadge: 'bg-rose-100 text-rose-900 border-rose-300',
    content: 'Chúa ơi, mỗi nhịp đập của trái tim con đều là một hồng ân Chúa ban. Xin cho con biết dùng chính cuộc sống bé nhỏ này để ngợi khen và làm vinh danh Chúa.',
    subtext: 'Mỗi nhịp đập trái tim đều là một hồng ân'
  },
  {
    id: 15,
    dayNum: 15,
    period: 'evening',
    periodName: 'Lời nguyện Ngày 15: Nghỉ Ngơi Trong Tình Chúa',
    theme: 'Bình Yên Tâm Hồn',
    themeBadge: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    content: 'Lạy Chúa Giêsu, xin nhắc nhở con rằng Chúa yêu con không phải vì con tài giỏi hay hoàn hảo, mà vì con là chính con. Xin cho tâm hồn con được nghỉ ngơi bình yên trong tình thương mến bao la của Ngài.',
    subtext: 'Chúa yêu con vì con là chính con'
  },
  {
    id: 16,
    dayNum: 16,
    period: 'night',
    periodName: 'Lời nguyện Ngày 16: Có Cha Đây Rồi, Đừng Sợ!',
    theme: 'Điểm Tựa Vững Chắc',
    themeBadge: 'bg-blue-100 text-blue-900 border-blue-300',
    content: 'Những lúc con buồn chán hay lo sợ, xin Chúa thì thầm vào tai con rằng "Có Cha đây rồi, đừng sợ!". Lời hứa của Chúa chính là điểm tựa vững chắc nhất của cuộc đời con.',
    subtext: 'Có Cha đây rồi, đừng sợ!'
  },
  {
    id: 17,
    dayNum: 17,
    period: 'noon',
    periodName: 'Lời nguyện Ngày 17: Phút Giây Thinh Lặng',
    theme: 'Lắng Nghe Tiếng Chúa',
    themeBadge: 'bg-amber-100 text-amber-900 border-amber-300',
    content: 'Lạy Chúa, xin dạy con biết thinh lặng đôi chút giữa ngày sống hối hả, để con lắng nghe được tiếng Chúa đang âu yếm gọi tên con.',
    subtext: 'Lắng nghe tiếng Chúa âu yếm gọi tên con'
  },
  {
    id: 18,
    dayNum: 18,
    period: 'morning',
    periodName: 'Lời nguyện Ngày 18: Phó Thác Cho Chúa Dẫn Đường',
    theme: 'Phó Thác Đơn Sơ',
    themeBadge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    content: 'Chúa ơi, xin cho con một tâm hồn trong trẻo, luôn tin tưởng phó thác mọi sự trong tay Chúa. Vì con biết, đường Chúa dẫn đi luôn là con đường chan chứa tình yêu và bình an.',
    subtext: 'Đường Chúa dẫn đi chan chứa tình yêu'
  },
  {
    id: 19,
    dayNum: 19,
    period: 'evening',
    periodName: 'Lời nguyện Ngày 19: Dưới Tà Áo Mẹ Maria',
    theme: 'Sùng Kính Đức Mẹ',
    themeBadge: 'bg-sky-100 text-sky-900 border-sky-300',
    content: 'Lạy Mẹ Maria, xin Mẹ dắt tay con đến gần Chúa Giêsu mỗi ngày một hơn. Xin Mẹ bao bọc tâm hồn con bằng tình mẫu tử, để con luôn biết sống đẹp lòng Chúa như Mẹ.',
    subtext: 'Mẹ dắt tay con đến gần Chúa Giêsu'
  },
  {
    id: 20,
    dayNum: 20,
    period: 'evening',
    periodName: 'Lời nguyện Ngày 20: Mãi Thuộc Trọn Về Chúa',
    theme: 'Dâng Hiến Trọn Vẹn',
    themeBadge: 'bg-amber-100 text-amber-900 border-amber-300',
    content: 'Lạy Chúa, con không xin gì hơn ngoài việc được Chúa yêu thương và được yêu Chúa hết lòng. Xin cho trái tim nhỏ bé của con mãi mãi thuộc trọn về Ngài.',
    subtext: 'Cho trái tim nhỏ bé mãi mãi thuộc về Chúa'
  }
];

/**
 * Hành Trình Đức Tin - Light of Christmas
 */
class FaithJourney {
  constructor() {
    this.milestones = {
      hero: false,
      advent: [false, false, false, false],
      dailyPrayer: false,
      nativityAdored: false
    };

    // ========================================================
    // ⚙️ CẤU HÌNH THỜI GIAN TỰ ĐỘNG XUẤT HIỆN BẢNG LỜI NGUYỆN
    // ========================================================
    this.prayerScheduleConfig = {
      hour: 19,    // 19h (7 giờ tối)
      minute: 20   // Phút thứ 20
    };

    // Danh sách lời cầu nguyện lấy trực tiếp từ mảng SACRED_PRAYERS_REPOSITORY (nguồn ở đầu file)
    this.dailyPrayers = SACRED_PRAYERS_REPOSITORY;
    const todayDate = new Date().getDate();
    this.currentPrayerIndex = (todayDate - 1) % this.dailyPrayers.length;

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

    // 5 mẫu hình nền Hang Đá Bêlem từ thư mục Thiep-pop-up + 1 mẫu giấy sáng mặc định
    this.cardBackgrounds = [
      {
        id: 'hang_da_01',
        name: 'Hang Đá 1',
        title: 'Đấng Cứu Thế Giáng Sinh',
        quote: '“Hôm nay Đấng Cứu Thế đã giáng sinh cho chúng ta”',
        image: 'Thiep-pop-up/Hang_da_01.jpg'
      },
      {
        id: 'hang_da_02',
        name: 'Hang Đá 2',
        title: 'Ánh Sao Bêlem Soi Lối',
        quote: '“Xin Ánh Sao Bêlem soi lối con mỗi ngày”',
        image: 'Thiep-pop-up/Hang_da_02.jpg'
      },
      {
        id: 'hang_da_03',
        name: 'Hang Đá 3',
        title: 'Giáng Sinh An Lành',
        quote: '“Giáng Sinh an lành, tràn đầy ơn Chúa”',
        image: 'Thiep-pop-up/Hang_da_03.jpg'
      },
      {
        id: 'hang_da_04',
        name: 'Hang Đá 4',
        title: 'Mở Cửa Lòng Đón Chúa',
        quote: '“Xin cho con biết mở cửa lòng đón Chúa”',
        image: 'Thiep-pop-up/Hang_da_04.jpg'
      },
      {
        id: 'hang_da_05',
        name: 'Hang Đá 5',
        title: 'Lan Tỏa Tình Yêu',
        quote: '“Nguyện xin tình yêu Chúa Hài Đồng lan tỏa đến mọi người”',
        image: 'Thiep-pop-up/Hang_da_05.jpg'
      },
      {
        id: 'default_card',
        name: 'Mặc Định',
        title: 'Ánh Kim Bêlem Truyền Thống',
        quote: '“Vinh danh Thiên Chúa trên trời, Bình an dưới thế cho người thiện tâm.”',
        image: ''
      }
    ];

    try {
      this.selectedCardBgId = localStorage.getItem('christmas_card_bg') || 'hang_da_01';
      this.cardRecipientName = localStorage.getItem('christmas_card_recipient') || 'Gia Đình Thân Yêu';
      this.cardLayoutStyle = localStorage.getItem('christmas_card_layout') || 'standard';
    } catch (e) {
      this.selectedCardBgId = 'hang_da_01';
      this.cardRecipientName = 'Gia Đình Thân Yêu';
      this.cardLayoutStyle = 'standard';
    }

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
            title: "LỜI NGUYỆN",
            icon: "🙏",
            subtext: "Cầu nguyện thắp sáng hy vọng",
            message: "Dành phút giây tĩnh tâm dâng lên Chúa lời cầu nguyện hy vọng và sốt sắng.",
            reflection: "Lời cầu nguyện chân thành như ngọn nến sáng xua tan bóng tối đêm đông, sưởi ấm tâm hồn và thắp lên trong lòng con niềm hy vọng rạng ngời đón chờ Chúa đến.",
            actionText: "Con sốt sắng dâng lời nguyện cầu hy vọng"
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
            title: "LỜI NGUYỆN",
            icon: "🙏",
            subtext: "Cầu nguyện củng cố đức tin",
            message: "Dâng lời cầu nguyện xin Chúa ban thêm đức tin son sắt và tấm lòng trong sạch.",
            reflection: "Lời cầu nguyện là nhịp cầu nối kết trái tim bé nhỏ của con với Chúa. Cầu nguyện giúp nuôi dưỡng đức tin sống động và dẫn bước con đi trong sự thánh thiện mỗi ngày.",
            actionText: "Con tha thiết cầu nguyện củng cố đức tin"
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
            title: "LỜI NGUYỆN",
            icon: "🙏",
            subtext: "Cầu nguyện tạ ơn hoan lạc",
            message: "Dâng lời nguyện ngợi khen và tạ ơn Thiên Chúa vì niềm vui cứu độ sắp đến gần.",
            reflection: "Lời nguyện tạ ơn đem lại niềm hoan lạc và bình an cho tâm hồn. Khi con cầu nguyện với lòng biết ơn, niềm vui Giáng Sinh sẽ lan tỏa đến mọi người xung quanh.",
            actionText: "Con hân hoan dâng lời nguyện tạ ơn"
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
            title: "LỜI NGUYỆN",
            icon: "🙏",
            subtext: "Cầu nguyện dọn lòng đón Chúa",
            message: "Dâng lời nguyện tha thiết dọn máng cỏ lòng mình thật ấm áp để đón Chúa Hài Đồng ngự vào.",
            reflection: "“Lạy Chúa Giêsu, xin hãy ngự đến trong lòng con.” Lời nguyện đơn sơ nhưng chân thành biến tâm hồn con thành máng cỏ ấm êm đầy ắp tình yêu đón Đấng Cứu Thế ra đời.",
            actionText: "Con dâng lời nguyện dọn máng cỏ lòng đón Chúa"
          },
          {
            id: 'card',
            title: "THIỆP GIÁNG SINH",
            icon: "💌",
            subtext: "Thêm tên & Popup gửi thiệp chúc lành",
            message: "Viết thiệp Giáng Sinh trao gửi lời cầu chúc yêu thương đến cha mẹ, bạn bè và người thân!",
            reflection: "Một cánh thiệp Giáng Sinh tự tay con thêm tên người nhận mang theo muôn ân phúc và sự ấm áp trong mùa đông Giáng Sinh.",
            actionText: "Bấm để Mở Thiệp & Chọn Hình Nền ✨"
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
    this.renderCardBgPicker();
    this.applyCardBackground();
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
      const isWordTask = task.id === 'word';
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
                  : (isCardTask ? '<span class="text-xs font-black px-3 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">💌 CÓ POPUP</span>' : (isWordTask ? '<span class="text-xs font-black px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">🙏 CẦU NGUYỆN</span>' : '<span class="text-xs font-black px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300">CHƯA LÀM</span>'))}
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
            <button class="${isDone ? 'm3-kids-btn-tonal bg-emerald-100 text-emerald-900 border-emerald-300' : (isCardTask || isWordTask ? 'm3-kids-btn-primary' : 'm3-kids-btn-tonal')} w-full py-2.5 text-xs sm:text-sm font-black">
              ${isDone ? '✓ ĐÃ HOÀN THÀNH' : (isCardTask ? '✨ MỞ THIỆP & THÊM TÊN' : (isWordTask ? '🙏 ĐỌC LỜI NGUYỆN' : '👉 BẤM ĐỂ HOÀN THÀNH'))}
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

    // Nếu là nhiệm vụ Lời Nguyện -> mở popup Lời Nguyện
    if (task.id === 'word') {
      this.completedStarTasks[this.currentStarWeek][taskIdx] = true;
      this.milestones.dailyPrayer = true;
      this.openPrayerModal();
      this.renderStarTasks(this.currentStarWeek);
      this.showTaskReflection(this.currentStarWeek, taskIdx);
      this.updateStarOfBethlehem();
      this.updateNativityPuzzleUI();
      this.updateProgressUI();
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

  // --- POPUP THIỆP GIÁNG SINH (Tuần 4) & TÙY CHỌN HÌNH NỀN THIEP-POP-UP ---

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

    this.renderCardBgPicker();
    this.applyCardBackground();

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

  renderCardBgPicker() {
    const container = document.getElementById('card-bg-picker-container');
    if (!container) return;

    container.innerHTML = this.cardBackgrounds.map(bg => {
      const isSelected = bg.id === this.selectedCardBgId;
      const activeClasses = isSelected
        ? 'ring-4 ring-amber-500 ring-offset-2 border-amber-500 scale-105 shadow-md bg-amber-100/90 font-black'
        : 'border-amber-200 hover:border-amber-400 hover:scale-102 bg-white opacity-85 hover:opacity-100';

      const thumbImg = bg.image 
        ? `<img src="${bg.image}" alt="${bg.name}" class="w-full h-11 sm:h-13 object-cover rounded-lg mb-1 group-hover:scale-105 transition-transform duration-300">`
        : `<div class="w-full h-11 sm:h-13 bg-gradient-to-tr from-amber-100 to-yellow-50 border border-amber-200 rounded-lg flex items-center justify-center text-lg mb-1 group-hover:scale-105 transition-transform">📜</div>`;

      return `
        <button type="button" 
                onclick="window.faithJourney.selectCardBackground('${bg.id}')"
                class="group relative flex flex-col items-center p-1.5 rounded-xl border-2 transition-all duration-200 cursor-pointer ${activeClasses}"
                title="${bg.name}: ${bg.title}">
          ${thumbImg}
          <span class="text-[10px] sm:text-[11px] font-black truncate max-w-full text-slate-800 leading-tight">
            ${bg.name}
          </span>
          ${isSelected ? '<span class="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-500 text-white rounded-full text-[11px] font-black flex items-center justify-center shadow-md animate-pulse">✓</span>' : ''}
        </button>
      `;
    }).join('');

    const titleEl = document.getElementById('card-bg-selected-title');
    if (titleEl) {
      const currentBg = this.cardBackgrounds.find(b => b.id === this.selectedCardBgId) || this.cardBackgrounds[0];
      titleEl.textContent = `${currentBg.name} - ${currentBg.title}`;
    }
  }

  selectCardBackground(bgId) {
    this.selectedCardBgId = bgId;
    try {
      localStorage.setItem('christmas_card_bg', bgId);
    } catch (e) {}

    if (window.sacredAudio) {
      window.sacredAudio.playChime('bell');
    }

    this.applyCardBackground();
    this.renderCardBgPicker();
  }

  applyCardBackground() {
    const printArea = document.getElementById('christmas-card-print-area');
    if (!printArea) return;

    const currentBg = this.cardBackgrounds.find(b => b.id === this.selectedCardBgId) || this.cardBackgrounds[0];
    const quoteEl = document.getElementById('card-preview-quote');
    if (quoteEl && currentBg.quote) {
      quoteEl.textContent = currentBg.quote;
    }

    if (currentBg.image) {
      printArea.style.backgroundImage = `url('${currentBg.image}')`;
      printArea.style.backgroundSize = 'cover';
      printArea.style.backgroundPosition = 'center';
      printArea.classList.remove('bg-[#fffef7]');
    } else {
      printArea.style.backgroundImage = 'none';
      printArea.style.backgroundColor = '#fffef7';
      printArea.classList.add('bg-[#fffef7]');
    }

    this.updateCardLayoutUI();
  }

  toggleCardLayoutStyle() {
    this.cardLayoutStyle = (this.cardLayoutStyle === 'standard') ? 'fullscreen' : 'standard';
    try {
      localStorage.setItem('christmas_card_layout', this.cardLayoutStyle);
    } catch (e) {}

    if (window.sacredAudio) {
      window.sacredAudio.playChime('bell');
    }

    this.updateCardLayoutUI();
  }

  updateCardLayoutUI() {
    const overlay = document.getElementById('card-content-overlay');
    const toggleBtn = document.getElementById('card-layout-toggle-btn');
    const currentBg = this.cardBackgrounds.find(b => b.id === this.selectedCardBgId) || this.cardBackgrounds[0];
    const isImageBg = Boolean(currentBg.image);

    if (toggleBtn) {
      toggleBtn.style.display = isImageBg ? 'inline-flex' : 'none';
      toggleBtn.innerHTML = this.cardLayoutStyle === 'fullscreen'
        ? '<span>📜 Xem Kiểu Khung Lời Chúc</span>'
        : '<span>🎨 Xem Tranh Toàn Cảnh</span>';
    }

    if (!overlay) return;

    if (this.cardLayoutStyle === 'fullscreen' && isImageBg) {
      // Kiểu toàn cảnh: Lớp phủ thu nhỏ xuống dưới đáy để lộ trọn vẹn bức tranh Hang Đá
      overlay.className = 'relative z-10 mt-auto bg-black/70 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-amber-300/60 shadow-xl text-white transition-all duration-500';
      const heading = overlay.querySelector('h4');
      if (heading) heading.className = 'text-base sm:text-lg font-black text-amber-300 uppercase tracking-tight mb-1';
      const nameBox = overlay.querySelector('#card-preview-name-container');
      if (nameBox) nameBox.className = 'my-1.5 py-1 px-3 border border-amber-400/60 bg-amber-950/50 rounded-xl';
      const quote = overlay.querySelector('#card-preview-quote');
      if (quote) quote.className = 'text-xs sm:text-sm font-serif italic text-amber-200 font-bold mb-1 leading-snug';
      const msg = overlay.querySelector('#card-preview-msg');
      if (msg) msg.className = 'text-[11px] sm:text-xs text-amber-100 font-medium leading-relaxed mb-1.5';
      const nameText = overlay.querySelector('#card-preview-name');
      if (nameText) nameText.className = 'text-lg sm:text-xl font-black text-amber-300 font-serif italic';
    } else {
      // Kiểu tiêu chuẩn: Khung thư mờ bán trong suốt ấm áp
      overlay.className = 'relative z-10 bg-white/85 sm:bg-white/80 backdrop-blur-[2px] rounded-2xl p-4 sm:p-6 border-2 border-amber-300/80 shadow-lg text-slate-900 transition-all duration-500';
      const heading = overlay.querySelector('h4');
      if (heading) heading.className = 'text-2xl sm:text-3xl font-black text-amber-800 uppercase tracking-tight mb-2 drop-shadow-xs';
      const nameBox = overlay.querySelector('#card-preview-name-container');
      if (nameBox) nameBox.className = 'my-3 py-2 px-3 border-2 border-dashed border-amber-400/80 bg-gradient-to-r from-amber-50/90 via-orange-50/90 to-amber-50/90 rounded-2xl shadow-inner';
      const quote = overlay.querySelector('#card-preview-quote');
      if (quote) quote.className = 'text-sm sm:text-base font-serif italic text-amber-950 font-black mb-2 leading-relaxed drop-shadow-2xs';
      const msg = overlay.querySelector('#card-preview-msg');
      if (msg) msg.className = 'text-xs sm:text-sm text-slate-800 font-extrabold leading-relaxed mb-3';
      const nameText = overlay.querySelector('#card-preview-name');
      if (nameText) nameText.className = 'text-2xl sm:text-3xl font-black text-rose-700 font-serif italic py-0.5 break-words drop-shadow-xs';
    }
  }

  viewCurrentCardArtwork() {
    const currentBg = this.cardBackgrounds.find(b => b.id === this.selectedCardBgId) || this.cardBackgrounds[0];
    if (!currentBg.image) {
      alert('Mẫu thiệp này dùng hoa văn giấy sáng mặc định.');
      return;
    }

    const modal = document.getElementById('task-media-viewer-modal');
    const titleEl = document.getElementById('media-viewer-title');
    const contentEl = document.getElementById('media-viewer-content');
    const timeEl = document.getElementById('media-viewer-time');
    const downloadBtn = document.getElementById('media-viewer-download');

    if (titleEl) {
      titleEl.innerHTML = `<span>🎨</span> <span>Hình Nền Thiệp: ${currentBg.name} – ${currentBg.title}</span>`;
    }
    if (timeEl) {
      timeEl.textContent = `Thư mục Thiep-pop-up • ${currentBg.quote}`;
    }
    if (downloadBtn) {
      downloadBtn.href = currentBg.image;
      downloadBtn.download = `${currentBg.name}.jpg`;
    }
    if (contentEl) {
      contentEl.innerHTML = `
        <div class="flex flex-col items-center p-2">
          <img src="${currentBg.image}" alt="${currentBg.name}" class="max-h-[68vh] max-w-full rounded-2xl shadow-2xl mx-auto border-2 border-amber-300 object-contain">
          <p class="mt-3 text-xs sm:text-sm font-black text-amber-900 bg-amber-100/90 px-4 py-1.5 rounded-full border border-amber-300 shadow-sm">${currentBg.quote}</p>
        </div>
      `;
    }

    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
  }

  updateCardRecipient(name) {
    this.cardRecipientName = name.trim() || 'Gia Đình Thân Yêu';
    try {
      localStorage.setItem('christmas_card_recipient', this.cardRecipientName);
    } catch (e) {}
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

    // 12 nhiệm vụ Dõi Theo Ánh Sao (4 tuần x 3 nhiệm vụ) = max 50%
    let completedStarCount = 0;
    for (let w = 0; w < 4; w++) {
      completedStarCount += this.completedStarTasks[w].filter(Boolean).length;
    }
    score += Math.round((completedStarCount / 12) * 50);

    if (this.milestones.nativityAdored) score += 20;
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
    const dayBadge = document.getElementById('prayer-modal-day-badge');
    if (dayBadge && prayer) {
      dayBadge.textContent = prayer.theme ? `${prayer.theme} • Bài #${this.currentPrayerIndex + 1}` : `Bài #${this.currentPrayerIndex + 1}`;
    }

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
    const dayBadge = document.getElementById('prayer-modal-day-badge');
    if (dayBadge && prayer) {
      dayBadge.textContent = prayer.theme ? `${prayer.theme} • Bài #${this.currentPrayerIndex + 1}` : `Bài #${this.currentPrayerIndex + 1}`;
    }

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
