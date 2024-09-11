import Link from '@/components/ui/link';
import cn from 'classnames';
import { siteSettings } from '@/settings/site.settings';
import { useSettings } from '@/contexts/settings.context';
import { LogoSVG } from '@/components/icons/logo';
import LogoText from '@/components/icons/logo-text';
import { useAtom } from 'jotai';
import { miniSidebarInitialValue } from '@/utils/constants';
import { useWindowSize } from '@/utils/use-window-size';
import { RESPONSIVE_WIDTH } from '@/utils/constants';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSettingsQuery } from '@/data/settings';

const Logo: React.FC<React.AnchorHTMLAttributes<{}>> = ({
  className,
  ...props
}) => {
  const { locale } = useRouter();
  const { settings } = useSettingsQuery({
    language: locale!,
  });
  const [miniSidebar, _] = useAtom(miniSidebarInitialValue);
  const { width } = useWindowSize();
  return (
    <Link
      href={siteSettings?.logo?.href}
      className={cn(
        'inline-flex items-center justify-center   gap-3 w-full',
        className,
      )}
      // {...props}
    >
      {miniSidebar && width >= RESPONSIVE_WIDTH ? (
        <div
        className="flex-row flex w-full font-serif text-lg tracking-wider font-semibold"
        style={{
          width: siteSettings.logo.width,
          height: siteSettings.logo.height,
        }}
      >
        <Image
          src={'/goodbloggerlogo.png'}
          alt={'Good blogger'}
          width={siteSettings.logo.width}
          height={siteSettings.logo.height}
        />
        {/* <Image
          src={settings?.options?.logo?.original ?? siteSettings.logo.url}
          alt={settings?.options?.siteTitle ?? siteSettings.logo.alt}
          fill
          sizes="(max-width: 768px) 100vw"
          className="object-contain"
          loading="eager"
        /> */}
      </div>
      ) : (
        <div
          className="flex-row flex w-full font-serif text-lg tracking-wider font-semibold"
          style={{
            width: siteSettings.logo.width,
            height: siteSettings.logo.height,
          }}
        >
          <Image
            src={'/goodbloggerlogo.png'}
            alt={'Good blogger'}
            width={siteSettings.logo.width}
            height={siteSettings.logo.height}
          />
          {/* <Image
            src={settings?.options?.logo?.original ?? siteSettings.logo.url}
            alt={settings?.options?.siteTitle ?? siteSettings.logo.alt}
            fill
            sizes="(max-width: 768px) 100vw"
            className="object-contain"
            loading="eager"
          /> */}
        </div>
      )}
    </Link>
  );
};

export default Logo;
