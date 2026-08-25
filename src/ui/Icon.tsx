import type { ComponentType } from 'react';
import type { IconWeight, PhosphorProps } from './phosphor-types';
import {
  AlarmIcon,
  ArrowRightIcon,
  ArrowsClockwiseIcon,
  ArrowsLeftRightIcon,
  BankIcon,
  BellIcon,
  BellSlashIcon,
  BookOpenIcon,
  BuildingsIcon,
  CalculatorIcon,
  CalendarBlankIcon,
  CalendarXIcon,
  CameraIcon,
  CaretDownIcon,
  CaretLeftIcon,
  CaretRightIcon,
  CaretUpIcon,
  ChatCircleIcon,
  ChatCircleDotsIcon,
  CheckIcon,
  CheckCircleIcon,
  ChecksIcon,
  CircleIcon,
  CircleHalfIcon,
  ClockIcon,
  CloudSlashIcon,
  CompassIcon,
  CreditCardIcon,
  CurrencyInrIcon,
  DeviceMobileIcon,
  DownloadSimpleIcon,
  EnvelopeIcon,
  EyeIcon,
  FileLockIcon,
  FileTextIcon,
  FlameIcon,
  GearIcon,
  GitBranchIcon,
  GlobeIcon,
  GraduationCapIcon,
  HandPalmIcon,
  HouseIcon,
  IdentificationCardIcon,
  InfoIcon,
  LifebuoyIcon,
  LightningIcon,
  ListChecksIcon,
  LockIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  MapTrifoldIcon,
  MinusIcon,
  MoonIcon,
  NavigationArrowIcon,
  NotePencilIcon,
  PauseIcon,
  PauseCircleIcon,
  PencilSimpleIcon,
  PhoneIcon,
  PlusIcon,
  ProhibitIcon,
  QuestionIcon,
  ReceiptIcon,
  RecordIcon,
  RepeatIcon,
  ScanIcon,
  ShieldIcon,
  ShieldCheckIcon,
  SignOutIcon,
  SlidersHorizontalIcon,
  SparkleIcon,
  StarIcon,
  TagIcon,
  TranslateIcon,
  TrashIcon,
  TrayIcon,
  UserIcon,
  UsersIcon,
  WalletIcon,
  WarningIcon,
  WarningCircleIcon,
  WhatsappLogoIcon,
  XIcon,
  XCircleIcon,
} from './phosphor-icons';


/**
 * Single icon surface for the whole app.
 *
 * Phosphor replaced Ionicons for its weight range - duotone and fill give the
 * traditional-modern direction character a single-weight outline set can't.
 *
 * Icons are imported individually rather than from the package barrel: that
 * barrel re-exports all 1,512 icons, which fails to resolve under Metro and
 * would be indefensible for bundle size either way.
 *
 * The map is keyed by the original Ionicons names, so the migration was one
 * file rather than fifty-eight - and swapping icon sets again stays a one-file
 * change.
 */
export type IconName = keyof typeof MAP;

type Comp = ComponentType<PhosphorProps>;

const MAP = {
  add: PlusIcon,
  alarm: AlarmIcon,
  alert: WarningIcon,
  'alert-circle': WarningCircleIcon,
  'alert-circle-outline': WarningCircleIcon,
  'arrow-forward': ArrowRightIcon,
  bank: BankIcon,
  'book-outline': BookOpenIcon,
  'business-outline': BuildingsIcon,
  'calculator-outline': CalculatorIcon,
  calendar: CalendarBlankIcon,
  'calendar-outline': CalendarBlankIcon,
  'calendar-clear-outline': CalendarXIcon,
  'call-outline': PhoneIcon,
  camera: CameraIcon,
  'camera-outline': CameraIcon,
  'card-outline': CreditCardIcon,
  'cash-outline': CurrencyInrIcon,
  'chatbox-outline': ChatCircleIcon,
  'chatbubble-ellipses': ChatCircleDotsIcon,
  'chatbubble-ellipses-outline': ChatCircleDotsIcon,
  'chatbubbles-outline': ChatCircleDotsIcon,
  checkmark: CheckIcon,
  'checkmark-circle': CheckCircleIcon,
  'checkmark-circle-outline': CheckCircleIcon,
  'checkmark-done': ChecksIcon,
  'chevron-back': CaretLeftIcon,
  'chevron-forward': CaretRightIcon,
  'chevron-up': CaretUpIcon,
  'chevron-down': CaretDownIcon,
  close: XIcon,
  'close-circle': XCircleIcon,
  'close-circle-outline': XCircleIcon,
  'cloud-offline': CloudSlashIcon,
  'cloud-offline-outline': CloudSlashIcon,
  'compass-outline': CompassIcon,
  'contrast-outline': CircleHalfIcon,
  'create-outline': PencilSimpleIcon,
  'document-lock-outline': FileLockIcon,
  'document-text': FileTextIcon,
  'document-text-outline': FileTextIcon,
  'download-outline': DownloadSimpleIcon,
  ellipse: CircleIcon,
  'ellipse-outline': CircleIcon,
  'eye-outline': EyeIcon,
  'file-tray-outline': TrayIcon,
  flame: FlameIcon,
  'flame-outline': FlameIcon,
  'flash-outline': LightningIcon,
  'git-branch-outline': GitBranchIcon,
  'globe-outline': GlobeIcon,
  'hand-left-outline': HandPalmIcon,
  'help-buoy': LifebuoyIcon,
  'help-buoy-outline': LifebuoyIcon,
  'help-circle': QuestionIcon,
  'help-circle-outline': QuestionIcon,
  home: HouseIcon,
  'home-outline': HouseIcon,
  'id-card': IdentificationCardIcon,
  'information-circle': InfoIcon,
  'information-circle-outline': InfoIcon,
  'language-outline': TranslateIcon,
  'list-outline': ListChecksIcon,
  location: MapPinIcon,
  'location-outline': MapPinIcon,
  'lock-closed': LockIcon,
  'lock-closed-outline': LockIcon,
  'log-out-outline': SignOutIcon,
  'logo-whatsapp': WhatsappLogoIcon,
  'mail-outline': EnvelopeIcon,
  'map-outline': MapTrifoldIcon,
  'moon-outline': MoonIcon,
  navigate: NavigationArrowIcon,
  'navigate-outline': NavigationArrowIcon,
  notifications: BellIcon,
  'notifications-outline': BellIcon,
  'notifications-off-outline': BellSlashIcon,
  'options-outline': SlidersHorizontalIcon,
  pause: PauseIcon,
  'pause-circle': PauseCircleIcon,
  'pause-circle-outline': PauseCircleIcon,
  'people-outline': UsersIcon,
  person: UserIcon,
  'person-outline': UserIcon,
  'phone-portrait-outline': DeviceMobileIcon,
  'pricetag-outline': TagIcon,
  'pricetags-outline': TagIcon,
  prohibit: ProhibitIcon,
  'radio-button-on': RecordIcon,
  'receipt-outline': ReceiptIcon,
  'refresh-circle': ArrowsClockwiseIcon,
  'refresh-outline': ArrowsClockwiseIcon,
  remove: MinusIcon,
  'repeat-outline': RepeatIcon,
  scan: ScanIcon,
  'school-outline': GraduationCapIcon,
  'search-outline': MagnifyingGlassIcon,
  'settings-outline': GearIcon,
  'shield-checkmark': ShieldCheckIcon,
  'shield-checkmark-outline': ShieldCheckIcon,
  'shield-outline': ShieldIcon,
  sparkles: SparkleIcon,
  star: StarIcon,
  'star-outline': StarIcon,
  'swap-horizontal-outline': ArrowsLeftRightIcon,
  time: ClockIcon,
  'time-outline': ClockIcon,
  'trash-outline': TrashIcon,
  wallet: WalletIcon,
  'wallet-outline': WalletIcon,
  'warning-outline': WarningIcon,
  'write-outline': NotePencilIcon,
} satisfies Record<string, Comp>;

/**
 * Filled names read as active/solid and map to Phosphor's `fill` weight;
 * `-outline` names stay regular. This preserves the selected/unselected
 * distinction the tab bar and status pills already rely on.
 */
const FILLED = new Set<string>([
  'alert',
  'alert-circle',
  'checkmark-circle',
  'close-circle',
  'flame',
  'home',
  'location',
  'lock-closed',
  'notifications',
  'person',
  'star',
  'time',
  'wallet',
  'calendar',
  'navigate',
  'shield-checkmark',
  'help-circle',
  'information-circle',
  'document-text',
  'ellipse',
  'pause',
  'prohibit',
  'scan',
  'sparkles',
  'checkmark-done',
  'refresh-circle',
  'bank',
  'id-card',
  'radio-button-on',
  'pause-circle',
  'chatbubble-ellipses',
  'camera',
]);

export function Icon({
  name,
  size = 20,
  color,
  weight,
  style,
}: {
  name: IconName;
  size?: number;
  color: string;
  weight?: IconWeight;
  style?: PhosphorProps['style'];
}) {
  const Cmp = MAP[name] as Comp;
  if (!Cmp) return null;
  const resolved: IconWeight = weight ?? (FILLED.has(name) ? 'fill' : 'regular');
  return <Cmp size={size} color={color} weight={resolved} style={style} />;
}

/** Duotone treatment for feature and marketing surfaces, never for dense UI. */
export function FeatureIcon({
  name,
  size = 24,
  color,
}: {
  name: IconName;
  size?: number;
  color: string;
}) {
  return <Icon name={name} size={size} color={color} weight="duotone" />;
}
