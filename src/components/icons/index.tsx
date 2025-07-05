import logoSvg from '../../assets/logo.svg'
import recentSvg from '../../assets/recently.svg'
import settingSvg from '../../assets/setting.svg'

export const OkiLogo = ({ size = 36, ...props }: { size?: number }) => {
  return (
    <img draggable={false} src={logoSvg} alt="Oki Logo" width={size} height={size} {...props} />
  )
}

export const SearchIcon = ({
  size = 24,
  strokeWidth = 1.5,
  width,
  height,
  ...props
}: {
  size?: number
  strokeWidth?: number
  width?: number
  height?: number
}) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height={height || size}
      role="presentation"
      viewBox="0 0 24 24"
      width={width || size}
      {...props}
    >
      <path
        d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
      <path
        d="M22 22L20 20"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
    </svg>
  )
}

export const RecentIcon = ({ size = 36, ...props }: { size?: number }) => {
  return (
    <img
      draggable={false}
      src={recentSvg}
      alt="Recent Icon"
      width={size}
      height={size}
      {...props}
    />
  )
}

export const SettingIcon = ({ size = 36, ...props }: { size?: number }) => {
  return (
    <img
      draggable={false}
      src={settingSvg}
      alt="Setting Icon"
      width={size}
      height={size}
      {...props}
    />
  )
}
