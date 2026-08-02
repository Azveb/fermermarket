import {
  AlertTriangle,
  ArrowRight,
  Bell,
  BellOff,
  Building2,
  Check,
  ChevronDown,
  CircleCheck,
  CreditCard,
  CircleX,
  ClipboardCheck,
  Heart,
  Home,
  Info,
  LayoutDashboard,
  Link2,
  LogOut,
  MapPin,
  MessageCircle,
  Newspaper,
  Package,
  Plus,
  Search,
  ShoppingCart,
  Sprout,
  Star,
  Trash2,
  Truck,
  UserCircle,
  UserRound,
  WalletCards,
  Send,
  ZoomIn,
  X,
  Apple, Bird, Bug, Carrot, Dog, Droplet, Fish, Leaf, Rabbit, Tractor, Wheat,
  Trees, Milk, Sun, CloudRain, Snowflake, Flame, Hexagon, Component, Grid, Tag, Box, Store, ShoppingBasket, CircleDollarSign, FlameKindling, Palmtree
} from "lucide-react";

export const ICONS = {
  alert: AlertTriangle,
  arrowRight: ArrowRight,
  bell: Bell,
  bellOff: BellOff,
  building: Building2,
  creditCard: CreditCard,
  check: Check,
  chevronDown: ChevronDown,
  checkCircle: CircleCheck,
  closeCircle: CircleX,
  clipboard: ClipboardCheck,
  heart: Heart,
  home: Home,
  info: Info,
  dashboard: LayoutDashboard,
  link: Link2,
  logout: LogOut,
  mapPin: MapPin,
  message: MessageCircle,
  newspaper: Newspaper,
  package: Package,
  plus: Plus,
  search: Search,
  cart: ShoppingCart,
  sprout: Sprout,
  star: Star,
  trash: Trash2,
  truck: Truck,
  user: UserRound,
  userCircle: UserCircle,
  wallet: WalletCards,
  send: Send,
  zoomIn: ZoomIn,
  close: X,
  apple: Apple,
  bird: Bird,
  bug: Bug,
  carrot: Carrot,
  dog: Dog,
  droplet: Droplet,
  fish: Fish,
  leaf: Leaf,
  rabbit: Rabbit,
  tractor: Tractor,
  wheat: Wheat,
  trees: Trees,
  milk: Milk,
  sun: Sun,
  cloudRain: CloudRain,
  snowflake: Snowflake,
  flame: Flame,
  flameKindling: FlameKindling,
  palmtree: Palmtree,
  hexagon: Hexagon,
  component: Component,
  grid: Grid,
  tag: Tag,
  box: Box,
  store: Store,
  basket: ShoppingBasket,
  dollar: CircleDollarSign,
};

export default function Icon({ name, size = 18, strokeWidth = 1.8, className = "", ...props }) {
  if (!name) name = "info";

  // URL dəstəyi
  if (name.startsWith("http://") || name.startsWith("https://") || name.startsWith("/")) {
    return <img src={name} alt="icon" width={size} height={size} className={`object-contain ${className}`} {...props} />;
  }

  // Emoji dəstəyi (əgər Icon siyahısında yoxdursa və qısa mətndirsə)
  if (!ICONS[name] && name.length <= 4) {
    return <span className={className} style={{ fontSize: size, lineHeight: 1 }} {...props}>{name}</span>;
  }

  const IconComponent = ICONS[name] || Info;
  return <IconComponent size={size} strokeWidth={strokeWidth} className={className} aria-hidden="true" {...props} />;
}
