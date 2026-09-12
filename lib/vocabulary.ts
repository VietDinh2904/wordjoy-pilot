export type Level = 'starters' | 'movers' | 'flyers';

export type VocabWord = {
  word: string;
  meaning: string;
  level: Level;
  topic: string;
  emoji: string;
  sprite?: number;
};

// A compact, reviewed pilot set. Level labels are teaching groups, not a complete exam wordlist.
export const vocabulary: VocabWord[] = [
  { word: 'apple', meaning: 'quả táo', level: 'starters', topic: 'Đồ ăn', emoji: '🍎', sprite: 0 },
  { word: 'banana', meaning: 'quả chuối', level: 'starters', topic: 'Đồ ăn', emoji: '🍌', sprite: 1 },
  { word: 'cat', meaning: 'con mèo', level: 'starters', topic: 'Con vật', emoji: '🐱', sprite: 2 },
  { word: 'dog', meaning: 'con chó', level: 'starters', topic: 'Con vật', emoji: '🐶', sprite: 3 },
  { word: 'bird', meaning: 'con chim', level: 'starters', topic: 'Con vật', emoji: '🐦', sprite: 4 },
  { word: 'fish', meaning: 'con cá', level: 'starters', topic: 'Con vật', emoji: '🐟', sprite: 5 },
  { word: 'elephant', meaning: 'con voi', level: 'starters', topic: 'Con vật', emoji: '🐘', sprite: 6 },
  { word: 'frog', meaning: 'con ếch', level: 'starters', topic: 'Con vật', emoji: '🐸', sprite: 7 },
  { word: 'bus', meaning: 'xe buýt', level: 'starters', topic: 'Đi lại', emoji: '🚌', sprite: 8 },
  { word: 'bike', meaning: 'xe đạp', level: 'starters', topic: 'Đi lại', emoji: '🚲', sprite: 9 },
  { word: 'kite', meaning: 'con diều', level: 'starters', topic: 'Đồ chơi', emoji: '🪁', sprite: 10 },
  { word: 'book', meaning: 'quyển sách', level: 'starters', topic: 'Trường học', emoji: '📚', sprite: 11 },
  { word: 'pencil', meaning: 'bút chì', level: 'starters', topic: 'Trường học', emoji: '✏️', sprite: 12 },
  { word: 'cake', meaning: 'bánh ngọt', level: 'starters', topic: 'Đồ ăn', emoji: '🎂', sprite: 13 },
  { word: 'ball', meaning: 'quả bóng', level: 'starters', topic: 'Đồ chơi', emoji: '⚽', sprite: 14 },
  { word: 'moon', meaning: 'mặt trăng', level: 'movers', topic: 'Thiên nhiên', emoji: '🌙', sprite: 15 },
  { word: 'star', meaning: 'ngôi sao', level: 'starters', topic: 'Thiên nhiên', emoji: '⭐', sprite: 16 },
  { word: 'robot', meaning: 'người máy', level: 'starters', topic: 'Đồ chơi', emoji: '🤖', sprite: 17 },
  { word: 'train', meaning: 'tàu hỏa', level: 'starters', topic: 'Đi lại', emoji: '🚂', sprite: 18 },
  { word: 'flower', meaning: 'bông hoa', level: 'starters', topic: 'Thiên nhiên', emoji: '🌼', sprite: 19 },
  { word: 'tree', meaning: 'cái cây', level: 'starters', topic: 'Thiên nhiên', emoji: '🌳' },
  { word: 'house', meaning: 'ngôi nhà', level: 'starters', topic: 'Nhà cửa', emoji: '🏠' },
  { word: 'chair', meaning: 'cái ghế', level: 'starters', topic: 'Nhà cửa', emoji: '🪑' },
  { word: 'door', meaning: 'cánh cửa', level: 'starters', topic: 'Nhà cửa', emoji: '🚪' },
  { word: 'window', meaning: 'cửa sổ', level: 'starters', topic: 'Nhà cửa', emoji: '🪟' },
  { word: 'car', meaning: 'ô tô', level: 'starters', topic: 'Đi lại', emoji: '🚗' },
  { word: 'boat', meaning: 'con thuyền', level: 'starters', topic: 'Đi lại', emoji: '⛵' },
  { word: 'plane', meaning: 'máy bay', level: 'starters', topic: 'Đi lại', emoji: '✈️' },
  { word: 'egg', meaning: 'quả trứng', level: 'starters', topic: 'Đồ ăn', emoji: '🥚' },
  { word: 'bread', meaning: 'bánh mì', level: 'starters', topic: 'Đồ ăn', emoji: '🍞' },
  { word: 'orange', meaning: 'quả cam', level: 'starters', topic: 'Đồ ăn', emoji: '🍊' },
  { word: 'pear', meaning: 'quả lê', level: 'starters', topic: 'Đồ ăn', emoji: '🍐' },
  { word: 'duck', meaning: 'con vịt', level: 'starters', topic: 'Con vật', emoji: '🦆' },
  { word: 'cow', meaning: 'con bò', level: 'starters', topic: 'Con vật', emoji: '🐄' },
  { word: 'horse', meaning: 'con ngựa', level: 'starters', topic: 'Con vật', emoji: '🐴' },
  { word: 'monkey', meaning: 'con khỉ', level: 'starters', topic: 'Con vật', emoji: '🐒' },
  { word: 'snake', meaning: 'con rắn', level: 'starters', topic: 'Con vật', emoji: '🐍' },
  { word: 'spider', meaning: 'con nhện', level: 'starters', topic: 'Con vật', emoji: '🕷️' },
  { word: 'giraffe', meaning: 'hươu cao cổ', level: 'starters', topic: 'Con vật', emoji: '🦒' },
  { word: 'zebra', meaning: 'ngựa vằn', level: 'starters', topic: 'Con vật', emoji: '🦓' },
  { word: 'tiger', meaning: 'con hổ', level: 'movers', topic: 'Con vật', emoji: '🐯' },
  { word: 'rabbit', meaning: 'con thỏ', level: 'movers', topic: 'Con vật', emoji: '🐰' },
  { word: 'turtle', meaning: 'con rùa', level: 'movers', topic: 'Con vật', emoji: '🐢' },
  { word: 'dolphin', meaning: 'cá heo', level: 'movers', topic: 'Con vật', emoji: '🐬' },
  { word: 'whale', meaning: 'cá voi', level: 'movers', topic: 'Con vật', emoji: '🐋' },
  { word: 'island', meaning: 'hòn đảo', level: 'movers', topic: 'Thiên nhiên', emoji: '🏝️' },
  { word: 'river', meaning: 'dòng sông', level: 'movers', topic: 'Thiên nhiên', emoji: '🏞️' },
  { word: 'mountain', meaning: 'ngọn núi', level: 'movers', topic: 'Thiên nhiên', emoji: '⛰️' },
  { word: 'forest', meaning: 'khu rừng', level: 'movers', topic: 'Thiên nhiên', emoji: '🌲' },
  { word: 'rainbow', meaning: 'cầu vồng', level: 'movers', topic: 'Thiên nhiên', emoji: '🌈' },
  { word: 'castle', meaning: 'lâu đài', level: 'flyers', topic: 'Địa điểm', emoji: '🏰' },
  { word: 'museum', meaning: 'bảo tàng', level: 'flyers', topic: 'Địa điểm', emoji: '🏛️' },
  { word: 'airport', meaning: 'sân bay', level: 'flyers', topic: 'Đi lại', emoji: '🛫' },
  { word: 'astronaut', meaning: 'phi hành gia', level: 'flyers', topic: 'Nghề nghiệp', emoji: '🧑‍🚀' },
  { word: 'engineer', meaning: 'kỹ sư', level: 'flyers', topic: 'Nghề nghiệp', emoji: '👷' },
  { word: 'mechanic', meaning: 'thợ máy', level: 'flyers', topic: 'Nghề nghiệp', emoji: '🧑‍🔧' },
  { word: 'journey', meaning: 'chuyến đi', level: 'flyers', topic: 'Đi lại', emoji: '🧳' },
  { word: 'adventure', meaning: 'cuộc phiêu lưu', level: 'flyers', topic: 'Đời sống', emoji: '🧭' },
  { word: 'competition', meaning: 'cuộc thi', level: 'flyers', topic: 'Đời sống', emoji: '🏆' },
  { word: 'environment', meaning: 'môi trường', level: 'flyers', topic: 'Thiên nhiên', emoji: '🌍' },
];

export const lookupWord = (raw: string) => vocabulary.find((item) => item.word === raw.trim().toLowerCase());
