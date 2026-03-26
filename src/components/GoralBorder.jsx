const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

export default function GoralBorder({ className = "" }) {
  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <img
        src="https://media.db.com/images/public/69c47b125cd04bab13cc4c97/69c971085_generated_01142f90.png"
        alt="Goralsky folklorny vzor"
        className="w-full h-12 md:h-16 object-cover opacity-80"
      />
    </div>
  );
}