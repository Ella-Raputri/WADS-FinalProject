export const UserData = ({data1, data2, margin}) => {
    return(
        <div className={`flex font-poppins mt-[0.7em] mt-[${margin}]`}>
            <p className='w-[50%] text-[#DD3833] font-medium font-kanit'>{data1}</p>
            <p className='w-[50%]'>{data2}</p>
        </div>
    )
}