import { FC } from 'react';
import nodeList from "./images";
const Active: FC = () => {
  return (
    <div>
      <div className='flex justify-center'>
        <div className='w-[1200px] flex flex-col gap-y-8 cursor-pointer my-4'>
          {
            nodeList.map(item => {
              return <img key={item.icon} src={item.icon} className='w-full' onClick={() => {
                const query = new URLSearchParams()
                query.append('vendorID', String(item.vendorID))
                query.append('only', item.only)
                query.append('vendorName', item.vendorName)
                window.open(window.cloudBeanRoute + "products?" + query.toString(), '_blank')
              }} />
            })
          }
        </div>
      </div>
      <div
        id="footer"
        className="bg-black text-sm text-gray-400 text-center p-3"
        style={{ minWidth: '72rem' }}
      >
        {'技术支持：基理科技'}
      </div>
    </div>

  );
};
export default Active