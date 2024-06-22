import { Trash, Edit } from "lucide-react";
const getNestedProperty = (obj, path) => {
  return path.split('.').reduce((obj, key) => (obj && obj[key] !== 'undefined') ? obj[key] : undefined, obj);
}

const Tables = ({ columns, data, onEdit, onDelete,edit,del }) => {
  
  return (
    <table className="w-full  ">
      <thead className="bg-ijau-400   ">
        <tr>
          <th className="text-start pl-6 font-normal">No</th>
          {columns.map((column, index) => (
            <th className="py-5  font-semibold text-start pl-4" key={index}>{column.header}</th>
          ))}
          <th className="text-end  font-normal  pr-6">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {data?.map((row, rowIndex) => (
          <tr className="border-b border-neutral-300" key={rowIndex}>
            <td className="text-center">{rowIndex + 1}</td> 
            {columns.map((column, colIndex) => (
              <td className="py-2 text-start pl-4" key={colIndex}>{getNestedProperty(row, column.accessor)}</td>
            ))}
            <td className="py-2 flex justify-end">
            <div onClick={() => onEdit(row)} className={`${edit} cursor-pointer ts active:scale-110 hover:scale-110`}>       
                  <Edit size={20} className="mr-2 mt-1" color="orange" />
              
            </div>
              <div onClick={() => onDelete(row)} className={`${del} cursor-pointer ts active:scale-110 hover:scale-110`}>
                 <Trash size={20} className="mr-2 mt-1" color="red" />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Tables;