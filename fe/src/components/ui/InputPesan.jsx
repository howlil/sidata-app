import v from'../../../public/vector.svg'

export default function InputPesan({value, placeholder,onClick}) {
  return (
    <div className=' w-full flex border pr-4  rounded-lg '>
      <input type="text" className='w-full py-1.5 text-sm text-neutral-900 outline-none pl-4 ring-0 rounded-l-lg active:border-none'  value={value} placeholder={placeholder} />
      <img onClick={onClick} src={v} alt="gmb"/>
    </div>
  )
}
