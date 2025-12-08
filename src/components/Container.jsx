



// src/components/Container.jsx
export default function Container({ children }) {
  return (
    <div className="max-w-6xl mx-auto w-full px-4 py-6 overflow-y-auto">
      {children}
    </div>
  )
}
