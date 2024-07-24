import { useTheme } from 'next-themes';
import { ThemeLightIcon } from '@/components/icons/theme-light-icon';
import { ThemeDarkIcon } from '@/components/icons/theme-dark-icon';
import Button from '@/components/ui/button';
import { useIsMounted } from '@/lib/hooks/use-is-mounted';
import { Tooltip } from '@mui/material';

export default function ThemeSwitcher() {
  const isMounted = useIsMounted();
  const { resolvedTheme, setTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';

  return (
    <Tooltip title={isDarkMode? 'Light Mode' : 'Dark Mode'}>
      <Button
        variant="icon"
        aria-label="Theme Switcher"
        onClick={() => setTheme(isDarkMode? 'light' : 'dark')}
        className="h-7 w-7"
      >
        <span className="absolute">
          {isMounted && isDarkMode && (
            <ThemeDarkIcon className="h-[19px] w-[19px]" />
          )}
          {isMounted &&!isDarkMode && <ThemeLightIcon className="h-5 w-5 text-[#0C1713]" />}
        </span>
      </Button>
    </Tooltip>
  );
}