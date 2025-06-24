// components/ProductList.jsx

import {
    BiSolidTrafficCone,
} from "react-icons/bi";
import {
    GiNails, GiTakeMyMoney
} from "react-icons/gi";
import {
    PiNumberEightLight,
    PiMapPinSimpleAreaFill
} from "react-icons/pi";
import {
    MdOutlineRepeat, MdDriveFileRenameOutline
} from "react-icons/md";
import { BsArrowCounterclockwise } from "react-icons/bs";
import { LuTally5 } from "react-icons/lu";
import { IoIosPerson } from "react-icons/io";


export const ProductList = ({
    title,
    items,
    isTaskList = false,
    selectedProductId,
    setSelectedProductId,
}) => {
    const isEmpty = items.length === 0;

    const renderProductDetails = (product, pay) => (
        <div className="mt-2 border border-muted rounded p-4 bg-background/10 text-sm grid grid-cols-2 gap-4">
            {product.clientId && (
                <p className="flex items-center gap-2 uppercase">
                    <IoIosPerson /> <strong className="capitalize">Client:</strong> {product.clientId.name}
                </p>
            )}
            <p className="flex items-center gap-2"><PiMapPinSimpleAreaFill /> <strong>Sari Section:</strong> {product.sariSection}</p>
            <p className="flex items-center gap-2"><GiNails /> <strong>Nails Count:</strong> {product.nailsCount}</p>
            <p className="flex items-center gap-2"><BiSolidTrafficCone /> <strong>Cones Used:</strong> {product.conesUsed}</p>
            <p className="flex items-center gap-2"><PiNumberEightLight className="rotate-90" /> <strong>Kolukkulu:</strong> {product.kolukkulu}</p>
            <p className="flex items-center gap-2"><MdOutlineRepeat /> <strong>Varasalu:</strong> {product.varasalu}</p>
            <p className="flex items-center gap-2"><BsArrowCounterclockwise /> <strong>Repeat:</strong> {product.repeat}</p>
            <p className="flex items-center gap-2"><LuTally5 /> <strong>Sarees:</strong> {product.numberOfSarees}</p>
            <p className="flex items-center gap-2"><MdDriveFileRenameOutline /> <strong>Design Name:</strong> {product.designName || "N/A"}</p>
            {pay !== undefined && <p className="flex items-center gap-2"><GiTakeMyMoney /> <strong>Pay:</strong> ₹{pay}</p>}
            {"windingAssigned" in product && product.windingAssigned && (
                <p className="flex items-center gap-2"><strong>Winding Assigned</strong></p>
            )}
            {"markingAssigned" in product && product.markingAssigned && (
                <p className="flex items-center gap-2"><strong>Marking Assigned</strong></p>
            )}
            {"chittamAssigned" in product && product.chittamAssigned && (
                <p className="flex items-center gap-2"><strong>Chittam Assigned</strong></p>
            )}
        </div>
    );

    return (
        <section className="bg-surface rounded-lg p-4 shadow">
            <h2 className="text-lg font-semibold mb-4">{title}</h2>
            {isEmpty ? (
                <p className="text-mutedText">
                    {isTaskList ? "No products assigned yet." : "No products ordered."}
                </p>
            ) : (
                <ul className="space-y-4">
                    {items.map((item) => {
                        const product = isTaskList ? item.productId : item;
                        const isSelected = selectedProductId === product._id;
                        const toggleSelect = () => setSelectedProductId(isSelected ? null : product._id);

                        return (
                            <li key={item._id}>
                                <button
                                    onClick={toggleSelect}
                                    className="w-full bg-accent/30 px-4 py-3 rounded-md flex justify-between items-center font-semibold transition"
                                >
                                    {product.productId}
                                    {isTaskList && (
                                        <span className="italic text-sm text-right font-medium">₹{item.pays}</span>
                                    )}
                                </button>
                                {isSelected && renderProductDetails(product, isTaskList ? item.pays : undefined)}
                            </li>
                        );
                    })}
                </ul>
            )}
        </section>
    );
};
