import Link from 'next/link';

interface StudyLinkProps {
  href: string;
  title: string;
  color: string;
}

export default function StudyLink({ href, title, color }: StudyLinkProps) {
  return (
    <Link
      href={href}
      className={`${color} text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm`}
    >
      {title}
    </Link>
  );
}
