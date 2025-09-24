'use client';

export default function Input({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  className = '',
  required = false,
  ...props
}) {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`
          block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm 
          ring-1 ring-inset ${error ? 'ring-red-500' : 'ring-gray-300'} 
          placeholder:text-gray-400 
          focus:ring-2 focus:ring-inset focus:ring-indigo-600 
          sm:text-sm sm:leading-6
          ${className}
        `}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
