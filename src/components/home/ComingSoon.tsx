interface ComingSoonProps {
  title: string;
}

export default function ComingSoon({ title }: ComingSoonProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-400 dark:text-gray-500 mb-3">{title}</h3>
      <div className="text-gray-500 dark:text-gray-400 italic text-sm">近日追加予定</div>
    </div>
  );
}
