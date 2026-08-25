/*
 * Plain-JS re-export shim for Phosphor icons.
 *
 * Phosphor ships untranspiled .tsx and its react-native export condition
 * points bundlers at that source. Importing it from TypeScript drags the
 * dependency's own TSX into our program, where icon-base.tsx fails against
 * this version of react-native-svg's types.
 *
 * Metro resolves this .js and bundles the real icons; TypeScript reads the
 * sibling .d.ts and never opens either file. Individual imports also keep us
 * clear of the package barrel, which re-exports all 1,512 icons.
 */
export { AlarmIcon } from 'phosphor-react-native/src/icons/Alarm';
export { ArrowRightIcon } from 'phosphor-react-native/src/icons/ArrowRight';
export { ArrowsClockwiseIcon } from 'phosphor-react-native/src/icons/ArrowsClockwise';
export { ArrowsLeftRightIcon } from 'phosphor-react-native/src/icons/ArrowsLeftRight';
export { BankIcon } from 'phosphor-react-native/src/icons/Bank';
export { BellIcon } from 'phosphor-react-native/src/icons/Bell';
export { BellSlashIcon } from 'phosphor-react-native/src/icons/BellSlash';
export { BookOpenIcon } from 'phosphor-react-native/src/icons/BookOpen';
export { BuildingsIcon } from 'phosphor-react-native/src/icons/Buildings';
export { CalculatorIcon } from 'phosphor-react-native/src/icons/Calculator';
export { CalendarBlankIcon } from 'phosphor-react-native/src/icons/CalendarBlank';
export { CalendarXIcon } from 'phosphor-react-native/src/icons/CalendarX';
export { CameraIcon } from 'phosphor-react-native/src/icons/Camera';
export { CaretDownIcon } from 'phosphor-react-native/src/icons/CaretDown';
export { CaretLeftIcon } from 'phosphor-react-native/src/icons/CaretLeft';
export { CaretRightIcon } from 'phosphor-react-native/src/icons/CaretRight';
export { CaretUpIcon } from 'phosphor-react-native/src/icons/CaretUp';
export { ChatCircleIcon } from 'phosphor-react-native/src/icons/ChatCircle';
export { ChatCircleDotsIcon } from 'phosphor-react-native/src/icons/ChatCircleDots';
export { CheckIcon } from 'phosphor-react-native/src/icons/Check';
export { CheckCircleIcon } from 'phosphor-react-native/src/icons/CheckCircle';
export { ChecksIcon } from 'phosphor-react-native/src/icons/Checks';
export { CircleIcon } from 'phosphor-react-native/src/icons/Circle';
export { CircleHalfIcon } from 'phosphor-react-native/src/icons/CircleHalf';
export { ClockIcon } from 'phosphor-react-native/src/icons/Clock';
export { CloudSlashIcon } from 'phosphor-react-native/src/icons/CloudSlash';
export { CompassIcon } from 'phosphor-react-native/src/icons/Compass';
export { CreditCardIcon } from 'phosphor-react-native/src/icons/CreditCard';
export { CurrencyInrIcon } from 'phosphor-react-native/src/icons/CurrencyInr';
export { DeviceMobileIcon } from 'phosphor-react-native/src/icons/DeviceMobile';
export { DownloadSimpleIcon } from 'phosphor-react-native/src/icons/DownloadSimple';
export { EnvelopeIcon } from 'phosphor-react-native/src/icons/Envelope';
export { EyeIcon } from 'phosphor-react-native/src/icons/Eye';
export { FileLockIcon } from 'phosphor-react-native/src/icons/FileLock';
export { FileTextIcon } from 'phosphor-react-native/src/icons/FileText';
export { FlameIcon } from 'phosphor-react-native/src/icons/Flame';
export { GearIcon } from 'phosphor-react-native/src/icons/Gear';
export { GitBranchIcon } from 'phosphor-react-native/src/icons/GitBranch';
export { GlobeIcon } from 'phosphor-react-native/src/icons/Globe';
export { GraduationCapIcon } from 'phosphor-react-native/src/icons/GraduationCap';
export { HandPalmIcon } from 'phosphor-react-native/src/icons/HandPalm';
export { HouseIcon } from 'phosphor-react-native/src/icons/House';
export { IdentificationCardIcon } from 'phosphor-react-native/src/icons/IdentificationCard';
export { InfoIcon } from 'phosphor-react-native/src/icons/Info';
export { LifebuoyIcon } from 'phosphor-react-native/src/icons/Lifebuoy';
export { LightningIcon } from 'phosphor-react-native/src/icons/Lightning';
export { ListChecksIcon } from 'phosphor-react-native/src/icons/ListChecks';
export { LockIcon } from 'phosphor-react-native/src/icons/Lock';
export { MagnifyingGlassIcon } from 'phosphor-react-native/src/icons/MagnifyingGlass';
export { MapPinIcon } from 'phosphor-react-native/src/icons/MapPin';
export { MapTrifoldIcon } from 'phosphor-react-native/src/icons/MapTrifold';
export { MinusIcon } from 'phosphor-react-native/src/icons/Minus';
export { MoonIcon } from 'phosphor-react-native/src/icons/Moon';
export { NavigationArrowIcon } from 'phosphor-react-native/src/icons/NavigationArrow';
export { NotePencilIcon } from 'phosphor-react-native/src/icons/NotePencil';
export { PauseIcon } from 'phosphor-react-native/src/icons/Pause';
export { PauseCircleIcon } from 'phosphor-react-native/src/icons/PauseCircle';
export { PencilSimpleIcon } from 'phosphor-react-native/src/icons/PencilSimple';
export { PhoneIcon } from 'phosphor-react-native/src/icons/Phone';
export { PlusIcon } from 'phosphor-react-native/src/icons/Plus';
export { ProhibitIcon } from 'phosphor-react-native/src/icons/Prohibit';
export { QuestionIcon } from 'phosphor-react-native/src/icons/Question';
export { ReceiptIcon } from 'phosphor-react-native/src/icons/Receipt';
export { RecordIcon } from 'phosphor-react-native/src/icons/Record';
export { RepeatIcon } from 'phosphor-react-native/src/icons/Repeat';
export { ScanIcon } from 'phosphor-react-native/src/icons/Scan';
export { ShieldIcon } from 'phosphor-react-native/src/icons/Shield';
export { ShieldCheckIcon } from 'phosphor-react-native/src/icons/ShieldCheck';
export { SignOutIcon } from 'phosphor-react-native/src/icons/SignOut';
export { SlidersHorizontalIcon } from 'phosphor-react-native/src/icons/SlidersHorizontal';
export { SparkleIcon } from 'phosphor-react-native/src/icons/Sparkle';
export { StarIcon } from 'phosphor-react-native/src/icons/Star';
export { TagIcon } from 'phosphor-react-native/src/icons/Tag';
export { TranslateIcon } from 'phosphor-react-native/src/icons/Translate';
export { TrashIcon } from 'phosphor-react-native/src/icons/Trash';
export { TrayIcon } from 'phosphor-react-native/src/icons/Tray';
export { UserIcon } from 'phosphor-react-native/src/icons/User';
export { UsersIcon } from 'phosphor-react-native/src/icons/Users';
export { WalletIcon } from 'phosphor-react-native/src/icons/Wallet';
export { WarningIcon } from 'phosphor-react-native/src/icons/Warning';
export { WarningCircleIcon } from 'phosphor-react-native/src/icons/WarningCircle';
export { WhatsappLogoIcon } from 'phosphor-react-native/src/icons/WhatsappLogo';
export { XIcon } from 'phosphor-react-native/src/icons/X';
export { XCircleIcon } from 'phosphor-react-native/src/icons/XCircle';
