import { clsx } from 'clsx';

export function SocialButton({ icon: Icon, provider, onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-white transition-transform hover:scale-[1.02]',
        className
      )}
    >
      <Icon className="w-5 h-5 mr-2" />
      <span>Login with {provider}</span>
    </button>
  );
}