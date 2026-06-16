'use client';

import Image from 'next/image';
import { useEffect, useState, type CSSProperties } from 'react';
import { SELECT_EXPO_BOOTH_EVENT, type SelectExpoBoothEventDetail } from '@/lib/expoEvents';
import { ArrowRight, Boxes, CalendarDays, ChevronLeft, ChevronRight, Cpu, Globe2, Trophy } from 'lucide-react';

type HighlightBooth = {
  id: string;
  brand: string;
  title: string;
  image: string;
  accent: string;
  overview: string;
  history: string[];
  products: string[];
  markets: string[];
  achievements: string[];
  technologies: string[];
};

const booths: HighlightBooth[] = [
  {
    id: '01',
    brand: 'Coca-Cola',
    title: 'Coca-Cola Experience Hub',
    image: '/images/booths/cocacola.webp',
    accent: '#dc1725',
    overview:
      'The Coca-Cola Company là một trong những tập đoàn đồ uống lớn nhất thế giới, nổi tiếng với hệ sinh thái nước giải khát đa dạng phục vụ hơn 200 quốc gia.',
    history: ['Thành lập năm 1892', 'Người sáng lập: John Stith Pemberton', 'Trụ sở: The Coca-Cola Company, Atlanta'],
    products: ['Coca-Cola Classic', 'Sprite', 'Fanta', 'Dasani'],
    markets: ['Hoạt động tại hơn 200 quốc gia', 'Phân phối hàng tỷ sản phẩm mỗi ngày', 'Mạng lưới phân phối phủ rộng toàn cầu'],
    achievements: ['Một trong những thương hiệu giá trị nhất thế giới', 'Dẫn đầu ngành nước giải khát trong hơn 100 năm', 'Sở hữu hệ sinh thái thương hiệu đồ uống đa dạng toàn cầu'],
    technologies: ['Hệ thống phân tích hành vi khách hàng bằng AI', 'Máy bán nước tự động thông minh', 'Công nghệ cá nhân hóa lựa chọn hương vị theo sở thích người dùng'],
  },
  {
    id: '02',
    brand: 'Pepsi',
    title: 'Pepsi Interactive Lab',
    image: '/images/booths/pepsi.webp',
    accent: '#1357c8',
    overview: 'PepsiCo là tập đoàn đa quốc gia chuyên về thực phẩm và đồ uống, nổi tiếng với chiến lược marketing sáng tạo.',
    history: ['Thành lập năm 1898', 'Người sáng lập: Caleb Bradham', 'Trụ sở: Purchase'],
    products: ['Pepsi', 'Mountain Dew', "Lay's", 'Gatorade'],
    markets: ['Hoạt động tại hơn 200 quốc gia', 'Một trong những tập đoàn FMCG lớn nhất thế giới', 'Mạng lưới phân phối mạnh tại Bắc Mỹ, châu Âu và châu Á'],
    achievements: ['Đối thủ cạnh tranh lớn nhất của Coca-Cola toàn cầu', 'Sở hữu nhiều thương hiệu thực phẩm nổi tiếng quốc tế', 'Tiên phong trong chiến lược quảng bá thương hiệu sáng tạo'],
    technologies: ['Hệ thống tương tác khách hàng thông minh theo thời gian thực', 'Phân tích dữ liệu hành vi người dùng trong môi trường bán lẻ', 'Nền tảng marketing số tự động hóa giúp tăng trải nghiệm thương hiệu'],
  },
  {
    id: '03',
    brand: 'Heineken',
    title: 'Heineken Future Brewing',
    image: '/images/booths/heineken.webp',
    accent: '#0b8c45',
    overview: 'Heineken N.V. là một trong những thương hiệu bia lớn nhất thế giới.',
    history: ['Thành lập năm 1864', 'Người sáng lập: Gerard Adriaan Heineken', 'Xuất xứ: Amsterdam'],
    products: ['Heineken Lager Beer', 'Tiger Beer', 'Strongbow'],
    markets: ['Có mặt tại hơn 190 quốc gia', 'Một trong những tập đoàn bia lớn nhất thế giới', 'Hệ thống phân phối mạnh tại châu Âu và châu Á'],
    achievements: ['Top thương hiệu bia lớn nhất thế giới', 'Tiên phong trong sản xuất bia bền vững', 'Liên tục đầu tư công nghệ tự động hóa nhà máy'],
    technologies: ['Hệ thống sản xuất bia tự động hóa thông minh', 'Công nghệ giám sát và kiểm định chất lượng bằng AI', 'Giải pháp tối ưu năng lượng và giảm phát thải trong sản xuất công nghiệp'],
  },
  {
    id: '04',
    brand: 'Tiger',
    title: 'Tiger Smart Distribution',
    image: '/images/booths/tiger.webp',
    accent: '#d88211',
    overview: 'Tiger Beer là thương hiệu bia nổi tiếng châu Á với mạng lưới phân phối rộng khắp khu vực Đông Nam Á.',
    history: ['Thành lập năm 1932', 'Xuất xứ: Singapore', 'Hiện thuộc hệ sinh thái của Heineken Asia Pacific'],
    products: ['Tiger Lager', 'Tiger Crystal', 'Tiger Platinum'],
    markets: ['Phân phối rộng khắp Đông Nam Á', 'Xuất hiện mạnh tại Singapore, Việt Nam, Malaysia, Thái Lan', 'Độ nhận diện thương hiệu cao trong phân khúc bia cao cấp'],
    achievements: ['Một trong những thương hiệu bia châu Á nổi tiếng nhất', 'Được phân phối rộng khắp thị trường ASEAN', 'Thuộc hệ thống sản xuất toàn cầu của Heineken'],
    technologies: ['Hệ thống quản lý chuỗi cung ứng thông minh', 'Công nghệ dự đoán nhu cầu thị trường và tối ưu tồn kho', 'Giải pháp tự động hóa logistics và quản lý phân phối sản phẩm'],
  },
  {
    id: '05',
    brand: 'Sabeco',
    title: 'Sabeco Industry Pavilion',
    image: '/images/booths/sabeco.webp',
    accent: '#b88405',
    overview: 'Sabeco là một trong những doanh nghiệp bia lớn nhất Việt Nam.',
    history: ['Thành lập năm 1977', 'Tên đầy đủ: Saigon Beer Alcohol Beverage Corporation', 'Trụ sở: Ho Chi Minh City'],
    products: ['Bia Saigon Special', 'Saigon Lager', '333 Beer'],
    markets: ['Một trong những thương hiệu bia lớn nhất Việt Nam', 'Hệ thống phân phối phủ rộng toàn quốc', 'Xuất khẩu sang nhiều thị trường quốc tế'],
    achievements: ['Doanh nghiệp bia lâu đời tại Việt Nam', 'Giữ thị phần lớn trong ngành bia nội địa', 'Đẩy mạnh chuyển đổi số trong sản xuất công nghiệp'],
    technologies: ['Dây chuyền sản xuất ứng dụng công nghệ Industry 4.0', 'Hệ thống tự động hóa toàn bộ quy trình sản xuất đồ uống', 'Nền tảng giám sát dữ liệu sản xuất theo thời gian thực'],
  },
  {
    id: '06',
    brand: 'Abbott',
    title: 'Abbott Healthcare Innovation',
    image: '/images/booths/abbott.webp',
    accent: '#159bd3',
    overview: 'Abbott Laboratories là tập đoàn chăm sóc sức khỏe toàn cầu.',
    history: ['Thành lập năm 1888', 'Người sáng lập: Wallace Calvin Abbott', 'Trụ sở: Abbott Park'],
    products: ['Ensure', 'Pedialyte', 'Medical diagnostic systems'],
    markets: ['Phân phối tại hơn 160 quốc gia', 'Một trong những tập đoàn y tế lớn nhất thế giới', 'Hiện diện mạnh tại thị trường chăm sóc sức khỏe toàn cầu'],
    achievements: ['Hơn 130 năm phát triển ngành chăm sóc sức khỏe', 'Tiên phong trong công nghệ thiết bị y tế', 'Dẫn đầu mảng dinh dưỡng và xét nghiệm y khoa'],
    technologies: ['Thiết bị theo dõi sức khỏe tích hợp cảm biến thông minh', 'Công nghệ phân tích dữ liệu y tế hỗ trợ chẩn đoán nhanh', 'Hệ thống chăm sóc sức khỏe cá nhân hóa ứng dụng trí tuệ nhân tạo'],
  },
  {
    id: '07',
    brand: 'Nutifood',
    title: 'Nutifood Nutrition Tech Lab',
    image: '/images/booths/nutifood.webp',
    accent: '#0c9b61',
    overview: 'Nutifood chuyên nghiên cứu và phát triển các sản phẩm dinh dưỡng cho nhiều nhóm khách hàng.',
    history: ['Thành lập năm 2000', 'Xuất xứ: Ho Chi Minh City'],
    products: ['GrowPLUS+', 'Nuti IQ Gold', 'NuVi'],
    markets: ['Phân phối rộng khắp Việt Nam', 'Xuất khẩu sang nhiều quốc gia châu Á', 'Tập trung mạnh vào thị trường dinh dưỡng trẻ em'],
    achievements: ['Một trong những thương hiệu dinh dưỡng lớn tại Việt Nam', 'Đầu tư mạnh vào nghiên cứu dinh dưỡng lâm sàng', 'Phát triển nhiều sản phẩm chuyên biệt cho từng nhóm người dùng'],
    technologies: ['Hệ thống phân tích dữ liệu dinh dưỡng cá nhân', 'Công nghệ đề xuất chế độ ăn uống tối ưu bằng AI', 'Nền tảng nghiên cứu và xây dựng giải pháp dinh dưỡng thông minh'],
  },
  {
    id: '08',
    brand: 'Vinamilk',
    title: 'Vinamilk DairyTech Future Zone',
    image: '/images/booths/vinamilk.webp',
    accent: '#1655d9',
    overview: 'Vinamilk là công ty sữa lớn nhất Việt Nam và thuộc nhóm thương hiệu thực phẩm hàng đầu Đông Nam Á.',
    history: ['Thành lập năm 1976', 'Trụ sở: Ho Chi Minh City'],
    products: ['Sữa tươi Vinamilk', 'Optimum Gold', 'Dielac', 'Probi Yogurt'],
    markets: ['Dẫn đầu thị trường sữa Việt Nam', 'Xuất khẩu tới hơn 50 quốc gia', 'Hiện diện mạnh tại Đông Nam Á và Trung Đông'],
    achievements: ['Thương hiệu sữa số 1 Việt Nam', 'Sở hữu hệ thống trang trại bò sữa công nghệ cao', 'Đạt nhiều tiêu chuẩn quốc tế về chất lượng sản phẩm'],
    technologies: ['Hệ thống trang trại bò sữa tự động hóa công nghệ cao', 'Công nghệ kiểm định chất lượng sản phẩm bằng AI', 'Dây chuyền sản xuất thông minh tối ưu hiệu suất và đảm bảo tiêu chuẩn dinh dưỡng'],
  },
];

const sectionMeta = [
  { label: 'Lịch sử', icon: CalendarDays, key: 'history' },
  { label: 'Sản phẩm chính', icon: Boxes, key: 'products' },
  { label: 'Thị trường phân phối', icon: Globe2, key: 'markets' },
  { label: 'Thành tựu nổi bật', icon: Trophy, key: 'achievements' },
  { label: 'Công nghệ nổi bật', icon: Cpu, key: 'technologies' },
] as const;

function BoothArticle({ booth, index }: { booth: HighlightBooth; index: number }) {
  return (
    <article
      data-reveal
      style={
        {
          '--reveal-delay': `${Math.min(index * 55, 280)}ms`,
          '--highlight-accent': booth.accent,
        } as CSSProperties
      }
      className="overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white shadow-[0_22px_70px_rgba(15,23,42,0.08)]"
    >
      <div className="grid lg:grid-cols-[0.72fr_1.28fr]">
        <div className="relative min-h-[260px] overflow-hidden bg-slate-950 lg:min-h-full">
          <Image src={booth.image} alt={booth.title} fill sizes="(min-width: 1024px) 36vw, 100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
          <div className="absolute bottom-5 left-5 right-5">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/70">Gian hàng {booth.id}</p>
            <h3 className="mt-2 text-2xl font-black leading-tight text-white">{booth.brand}</h3>
          </div>
        </div>

        <div className="p-5 sm:p-7 lg:p-8">
          <div className="flex flex-wrap items-start gap-4">
            <span className="font-mono text-4xl font-black leading-none tabular-nums text-[var(--highlight-accent)]">{booth.id}</span>
            <div className="min-w-0">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">{booth.brand}</p>
              <h3 className="mt-1 text-2xl font-black leading-tight text-slate-950">{booth.title}</h3>
            </div>
          </div>

          <p className="mt-5 max-w-[82ch] text-sm font-medium leading-7 text-slate-600">{booth.overview}</p>

          <div className="mt-6 grid gap-x-8 gap-y-6 md:grid-cols-2 xl:grid-cols-3">
            {sectionMeta.map((section) => {
              const Icon = section.icon;
              const items = booth[section.key];

              return (
                <section key={section.key} className="border-t border-slate-200 pt-4">
                  <div className="mb-3 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">
                    <Icon className="h-4 w-4 text-[var(--highlight-accent)]" />
                    {section.label}
                  </div>
                  <ul className="space-y-2">
                    {items.map((item) => (
                      <li key={item} className="flex gap-2 text-sm font-medium leading-6 text-slate-700">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--highlight-accent)]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>

          <a
            href="#trien-lam"
            className="mt-7 inline-flex h-10 items-center gap-2 rounded-[0.8rem] bg-slate-950 px-4 text-xs font-black text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-blue-700 active:scale-[0.98]"
          >
            Xem vị trí gian hàng
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
}

export function BrandHighlights() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeBooth = booths[activeIndex];
  const totalLabel = booths.length.toString().padStart(2, '0');

  const goToBooth = (index: number) => {
    setActiveIndex((index + booths.length) % booths.length);
  };

  useEffect(() => {
    const handleBoothSelect = (event: Event) => {
      const boothId = (event as CustomEvent<SelectExpoBoothEventDetail>).detail?.boothId;
      const nextIndex = booths.findIndex((booth) => booth.id === boothId);

      if (nextIndex >= 0) {
        setActiveIndex(nextIndex);
      }
    };

    window.addEventListener(SELECT_EXPO_BOOTH_EVENT, handleBoothSelect);

    return () => {
      window.removeEventListener(SELECT_EXPO_BOOTH_EVENT, handleBoothSelect);
    };
  }, []);

  return (
    <section id="cong-nghe" className="expo-section-light relative overflow-hidden py-16 sm:py-20">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <div data-reveal className="mb-8 sm:mb-10">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-600">Featured booths</p>
            <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.035em] text-slate-950 sm:text-4xl">
              Khám phá đầy đủ các gian hàng
            </h2>
          </div>
        </div>

        <div data-reveal className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => goToBooth(activeIndex - 1)}
              className="grid h-11 w-11 place-items-center rounded-[0.85rem] border border-slate-200 bg-white text-slate-700 shadow-[0_12px_30px_rgba(15,23,42,0.08)] transition-all duration-300 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 active:scale-[0.96]"
              aria-label="Gian hàng trước"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="min-w-[112px] rounded-[0.9rem] border border-slate-200 bg-white px-4 py-2.5 text-center shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
              <span className="font-mono text-sm font-black tabular-nums text-slate-950">
                {activeBooth.id} / {totalLabel}
              </span>
              <p className="mt-0.5 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Gian hàng</p>
            </div>
            <button
              type="button"
              onClick={() => goToBooth(activeIndex + 1)}
              className="grid h-11 w-11 place-items-center rounded-[0.85rem] border border-slate-200 bg-white text-slate-700 shadow-[0_12px_30px_rgba(15,23,42,0.08)] transition-all duration-300 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 active:scale-[0.96]"
              aria-label="Gian hàng tiếp theo"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
            {booths.map((booth, index) => {
              const isActive = activeIndex === index;

              return (
                <button
                  key={booth.id}
                  type="button"
                  onClick={() => goToBooth(index)}
                  className={`shrink-0 rounded-[0.8rem] border px-3 py-2 text-left transition-all duration-300 active:scale-[0.98] ${
                    isActive
                      ? 'border-blue-200 bg-blue-50 text-blue-700 shadow-[0_12px_28px_rgba(37,99,235,0.12)]'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950'
                  }`}
                  aria-current={isActive ? 'true' : undefined}
                >
                  <span className="font-mono text-[11px] font-black tabular-nums">{booth.id}</span>
                  <span className="ml-2 text-xs font-black">{booth.brand}</span>
                </button>
              );
            })}
          </div>
        </div>

        <BoothArticle booth={activeBooth} index={activeIndex} />
      </div>
    </section>
  );
}
