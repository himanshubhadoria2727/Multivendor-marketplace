import cn from 'classnames';
import Image from '@/components/ui/image';
import AnchorLink from '@/components/ui/links/anchor-link';
import routes from '@/config/routes';
import { useIsMounted } from '@/lib/hooks/use-is-mounted';
import { useIsDarkMode } from '@/lib/hooks/use-is-dark-mode';
import { siteSettings } from '@/data/static/site-settings';
import { useSettings } from '@/data/settings';

export default function   Logo({
  className = 'w-50',
  ...props
}: React.AnchorHTMLAttributes<{}>) {
  const isMounted = useIsMounted();
  const { isDarkMode } = useIsDarkMode();
  const { lightLogo, darkLogo } = siteSettings;
  const { settings }: any = useSettings();
  return (
    <AnchorLink
      href={routes.home}
      className={cn(
        'relative flex items-center text-dark focus:outline-none dark:text-light',
        className
      )}
      {...props}
    >
      <span
        className="relative left-1  top-1.5 text-lg dark:text-white text-gray-800 font-serif font-semibold tracking-wider"
        style={{
          width: siteSettings?.width,
          height: siteSettings?.height,
        }}
      >
        {/* GoodBlogger */}
        {isMounted && isDarkMode && (
          <Image
            src={settings?.dark_logo?.original ?? darkLogo}
            fill
            loading="eager"
            alt={settings?.siteTitle ?? 'Dark Logo'}
            className="object-contain"
            priority
            sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
          />
        )}
        {isMounted && !isDarkMode && (
          <Image
            src={settings?.logo?.original ?? lightLogo}
            fill
            loading="eager"
            alt={settings?.siteTitle ?? 'Light Logo'}
            className="object-contain"
          />
        )}
      </span>
    </AnchorLink>
  );
}
