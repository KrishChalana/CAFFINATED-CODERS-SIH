import "./DropDown.css"

export default function DropDown(props) {
    return (


        <>

            <label className="mt-5 flex flex-col gap-2">
                <span className="text-gray-600 text-xl font-medium px-2">
                    {props.text}
                </span>
                <select
                    name={props.title}
                    id={props.title}
                    className="doodle-select form-select w-full rounded-2xl border-4 border-gray-700 bg-white text-gray-800 text-lg focus:border-amber-500 focus:ring-amber-500"
                >
                    {props.values.map((element) => (
                        <option  className="text-center" key={element} value={element}>
                            {element}
                        </option>
                    ))}
                </select>
            </label>


        </>
    )
}