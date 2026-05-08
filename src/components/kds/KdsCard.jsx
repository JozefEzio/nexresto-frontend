import { BikeIcon, CheckCircle, Clock, Timer, UtensilsIcon } from 'lucide-react';
import LiveChrono from '../../config/LiveChrono';
import FormatTimeAgo from '../../config/FormatTimeAgo';


const KdsCard = ({ order, status, onUpdateStatus }) => {
    if (!status || !order || !status[order.status]) {
        return <div className="p-4 border">Loading status...</div>;
    }
    const status_config = {
        new: { mainColor: status.new.color, hoverColor: status.new.hover, label: 'Start Preparing', next: 'preparing', icon: <Clock size={25} className="text-white" /> },
        preparing: { mainColor: status.preparing.color, hoverColor: status.preparing.hover, label: 'Mark as Ready', next: 'ready', icon: <Timer size={25} className="text-white" /> },
        ready: { mainColor: status.ready.color, hoverColor: status.ready.hover, label: 'Send to Driver', next: 'shipping', icon: <CheckCircle size={25} className="text-white" /> },
        shipping: { mainColor: status.shipping.color, hoverColor: status.shipping.hover, label: null, next: null, icon: <BikeIcon size={25} className="text-white" /> }
    };
    const config = status_config[order.status]
    if (!config) return null


    const current_status = status_config[order.status];
    // console.log(order.order_number,current_status)

    return (
        <div
            className="bg-white rounded-2xl overflow-hidden shadow-sm border"
            style={{ borderColor: current_status.mainColor }}
        >
            <div className="px-4 py-2" style={{ backgroundColor: current_status.mainColor }}>
                <div className="flex items-center gap-5 mb-1">
                    <div className="bg-white/20 p-3 rounded-2xl">
                        {current_status.icon}
                    </div>
                    <div className="w-full">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-white font-bold">#{order.order_number}</span>
                            <span className="text-white font-bold text-lg">
                                <FormatTimeAgo dateString={order.created_at} />
                            </span>
                        </div>
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-white/80 flex items-center gap-1 text-sm">
                                {order.type === 'delivery'
                                    ? <><BikeIcon size={16} /> Delivery</>
                                    : <><UtensilsIcon size={16} /> On-site</>}
                            </span>
                            <span className="text-white font-bold text-lg">
                                <LiveChrono estimatedTime={order.estimated_time} status={order.status} />
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-4 py-3 flex flex-col gap-2">
                {order.order_item?.map(item => (
                    <div key={item.id} className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 flex-1 min-w-0">
                            <span className="text-gray-400 w-4 font-bold">{item.quantity}</span>
                            <div>
                                <p className="text-gray-800 font-medium leading-tight text-sm">
                                    {item.product?.name ?? `Product #${item.product_id}`}
                                </p>
                                {item.notes && <p className="text-red-400 text-xs mt-0.5">({item.notes})</p>}
                            </div>
                        </div>
                        <span className="text-gray-400 text-xs">
                            {(item.price * item.quantity).toFixed(2)} DH
                        </span>
                    </div>
                ))}

                <div className="flex items-center justify-between py-2 border-t border-gray-100 mt-2">
                    <span className="text-gray-500 font-medium">Total</span>
                    <span className="text-gray-800 font-bold">{Number(order.total_price).toFixed(2)} DH</span>
                </div>
                {/* Single clean button logic */}
                {/* Items section stays the same... */}

                {/* ── Clean button logic — one condition per case ── */}
                <div className="px-4 pb-4 pt-1">
                    {order.status === 'new' && (
                        <button
                            onClick={() => onUpdateStatus(order, 'preparing')}
                            className="w-full py-2.5 rounded-xl text-white font-bold cursor-pointer hover:opacity-90 transition-all"
                            style={{ backgroundColor: current_status.mainColor }}
                        >
                            Start Preparing ›
                        </button>
                    )}

                    {order.status === 'preparing' && (
                        <button
                            onClick={() => onUpdateStatus(order, 'ready')}
                            className="w-full py-2.5 rounded-xl text-white font-bold cursor-pointer hover:opacity-90 transition-all"
                            style={{ backgroundColor: current_status.mainColor }}
                        >
                            Mark as Ready ›
                        </button>
                    )}

                    {order.status === 'ready' && order.type === 'delivery' && (
                        <button
                            onClick={() => onUpdateStatus(order, 'shipping')}
                            className="w-full py-2.5 rounded-xl text-white font-bold cursor-pointer hover:opacity-90 transition-all"
                            style={{ backgroundColor: current_status.mainColor }}
                        >
                            Complete Order ›
                        </button>
                    )}

                </div>
            </div>
        </div>
    );
}

export default KdsCard