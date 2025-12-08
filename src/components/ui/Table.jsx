



export default function Table({ 
    headers = [], 
    rows = [], 
    className = '' 
  }) {
    return (
      <div className={`overflow-x-auto ${className}`}>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-neutral-800">
              {headers.map((header, index) => (
                <th 
                  key={index}
                  className="px-4 py-3 text-left text-sm font-medium text-neutral-300"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr 
                key={rowIndex}
                className="border-b border-neutral-800 hover:bg-neutral-800/50 transition"
              >
                {row.map((cell, cellIndex) => (
                  <td 
                    key={cellIndex}
                    className="px-4 py-3 text-sm text-neutral-300"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }