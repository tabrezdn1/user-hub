import { CommandLineIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import Link from 'next/link';

export default function GutenbergLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <Link href="/">
        <p className="text-[44px]">Gutenberg</p>
        <CommandLineIcon className="h-12 w-12 rotate-[15deg]" />
      </Link>

    </div>
  );
}
