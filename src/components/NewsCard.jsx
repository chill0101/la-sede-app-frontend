
export default function NewsCard({ title, date, excerpt }) {
  return (
    <article className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 shadow-sm hover:bg-neutral-800 transition">
      <h3 className="text-base font-semibold text-neutral-100">{title}</h3>
      {date && <p className="text-xs text-neutral-500 mt-1">{date}</p>}
      {excerpt && <p className="text-sm text-neutral-300 mt-3">{excerpt}</p>}
      <button className="mt-4 text-sm font-medium text-red-400 hover:text-red-300">
        Inicia Sesion para ver mas →
      </button>
    </article>
  );
}
