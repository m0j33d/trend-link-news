import { connect } from "react-redux";
import { setAlertDetails } from "../../utils/utils";


const AlertBox = ({ className, alert_details }) => {
    const handleClose = () => setAlertDetails(null)

    return (
        <>
            <section className="flex justify-center w-screen">
                <div
                    className={`
                ${className ?? ""} 
                ${alert_details?.type ?? "hidden"} 
                ${alert_details?.type === "danger" ? "bg-red-400" : "bg-green-400"} 
                flex flex-row justify-between p-2 text-center rounded-lg
                max-w-3xl md:w-1/2 z-0 fixed mt-12 opacity-75
                
                `}
                >
                    <span className="text-center w-full text-black">{alert_details?.msg}</span>

                    <button className="font-extrabold px-4 hover:cursor-pointer text-white" onClick={handleClose}>
                        &times;
                    </button>

                </div>
            </section>

        </>
    );
};

const mapStateToProps = (state) => {
    return {
        alert_details: state.alert_details,
    };
};

export default connect(mapStateToProps)(AlertBox);