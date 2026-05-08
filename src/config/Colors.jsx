// src/config/colors.js

// ── Brand ───────────────────────────────────────────────
export const brand = {
    orange: '#FF6B00',
    orangeLight: '#FF8C38',
    orangePale: '#FFF0E6',
    orangeDark: '#CC5500',
    black: '#1A1A1A',
    gray: '#939393',
    background: '#F7F7F8',
    white: '#FFFFFF',
    border: '#F0F0F0',
}

// ── Order Status ────────────────────────────────────────
export const status_color = {
    new: {
        bg: '#2E81E0',
        pale: '#EBF4FF',
        text: '#1a5fa8',
        label: 'New',
    },
    preparing: {
        bg: '#FF6B00',
        pale: '#FFF0E6',
        text: '#CC5500',
        label: 'Preparing',
    },
    ready: {
        bg: '#22C55E',
        pale: '#EDFAF3',
        text: '#16873f',
        label: 'Ready',
    },
    delivered: {
        bg: '#8B5CF6',
        pale: '#F3EFFE',
        text: '#6027d6',
        label: 'Delivered',
    },
    cancelled: {
        bg: '#EF4444',
        pale: '#FEF0F0',
        text: '#b91c1c',
        label: 'Cancelled',
    },
    shipping: {
        bg: '#F59E0B',
        pale: '#FFFBEB',
        text: '#b45309',
        label: 'Shipping',
    },
    unknown: {
        bg: '#E5E7EB',
        pale: '#F9FAFB',
        text: '#6B7280',
        label: 'Unknown',
    },
}

// ── KDS filter buttons ──────────────────────────────────
export const kds_status = {
    all: {
        color: '#1A1A1A',
        hover: '#000000',
        active: 'bg-[#1A1A1A] text-white border-[#1A1A1A]',
        inactive: 'bg-white text-gray-600 border-gray-200 hover:border-gray-400',
    },
    new: {
        color: '#2E81E0',
        hover: '#1d6abf',
        active: 'bg-[#2E81E0] text-white border-[#2E81E0]',
        inactive: 'bg-white text-[#2E81E0] border-[#2E81E0]/30 hover:border-[#2E81E0]',
    },
    preparing: {
        color: '#FF6B00',
        hover: '#e66000',
        active: 'bg-[#FF6B00] text-white border-[#FF6B00]',
        inactive: 'bg-white text-[#FF6B00] border-[#FF6B00]/30 hover:border-[#FF6B00]',
    },
    ready: {
        color: '#22C55E',
        hover: '#1ba84e',
        active: 'bg-[#22C55E] text-white border-[#22C55E]',
        inactive: 'bg-white text-[#22C55E] border-[#22C55E]/30 hover:border-[#22C55E]',
    },
    shipping: {
        color: '#7C3AED',
        hover: '#6D28D9',
        active: 'bg-[#7C3AED] text-white border-[#7C3AED]',
        inactive: 'bg-white text-[#7C3AED] border-[#7C3AED]/30 hover:border-[#7C3AED]',
    },
}

export const payment_methode = {
    cash: {
        bg: '#61daa1',
        text: '#2ba36a',
        border: '#10B981',
        hover: '#D1FAE5',
    },
    card: {
        bg: '#5988c4',
        text: '#4570a8',
        border: '#3B82F6',
        hover: '#DBEAFE',
    },
    ewallet: {
        bg: '#947ffb',
        text: '#7d68e2',
        border: '#8B5CF6',
        hover: '#EDE9FE',
    },
    giftcards: {
        bg: '#eabf8a',
        text: '#cb9c61',
        border: '#F97316',
        hover: '#FFEDD5',
    },
    unknown: {
        bg: '#E5E7EB',
        pale: '#F9FAFB',
        text: '#6B7280',
        label: 'Unknown',
    },
}

// ── Roles ───────────────────────────────────────────────
export const role_colors = {
    Admin: 'bg-purple-50 text-purple-600',
    Cashier: 'bg-blue-50 text-blue-600',
    Chef: 'bg-orange-50 text-[#FF6B00]',
    Driver: 'bg-green-50 text-green-600',
    Client: 'bg-gray-100 text-gray-500',
}

// ── Category card colors (matches POS) ──────────────────
export const category_colors = {
    Breakfast: { color: '#CFDDDB', hover: '#B8C9C7' },
    Soups: { color: '#E4CDED', hover: '#D1B5DB' },
    Pasta: { color: '#C2DBE9', hover: '#A9C7D9' },
    Suchi: { color: '#C9CAEF', hover: '#B1B2DB' },
    'Main course': { color: '#FAC1D9', hover: '#E8A9C2' },
    Desserts: { color: '#E5DADE', hover: '#CDC1C5' },
    Drinks: { color: '#F1C8D0', hover: '#DBB1B9' },
    'Traditional dishes': { color: '#C2E9DD', hover: '#A9D6C8' },
    Salads: { color: '#DFF3E3', hover: '#C8E4CD' },
    Pizza: { color: '#FDE2E4', hover: '#E9C8CB' },
    Burgers: { color: '#FFF1E6', hover: '#E9D9CD' },
    Appetizers: { color: '#EDF2FB', hover: '#D7E1F5' },
    default: { color: '#F3F4F6', hover: '#E5E7EB' },
}

// ── Dashboard stat cards ────────────────────────────────
export const stat_colors = {
    revenue: { bg: '#C2E9DD', iconColor: '#16873f' },   // green
    orders: { bg: '#C2DBE9', iconColor: '#1a5fa8' },   // blue
    average: { bg: '#C9CAEF', iconColor: '#6027d6' },   // purple
    pending: { bg: '#FFF0E6', iconColor: '#CC5500' },   // brand orange pale
    delivered: { bg: '#DFF3E3', iconColor: '#16873f' },   // green light
    cancelled: { bg: '#FEF0F0', iconColor: '#b91c1c' },   // red pale
    delivery: { bg: '#E4CDED', iconColor: '#7c3aed' },   // purple light
    dinein: { bg: '#CFDDDB', iconColor: '#1a5fa8' },   // teal
    items: { bg: '#FAC1D9', iconColor: '#c0557a' },   // pink
    revenue2: { bg: '#FFF1E6', iconColor: '#CC5500' },   // orange pale
}

// ── Quick links (dashboard) ─────────────────────────────
export const quick_link_colors = {
    pos: { bg: '#FAC1D9', textColor: '#c0557a' },
    kds: { bg: '#C2DBE9', textColor: '#1a5fa8' },
    settings: { bg: '#C9CAEF', textColor: '#6027d6' },
    users: { bg: '#C2E9DD', textColor: '#16873f' },
}

// ── Helpers ─────────────────────────────────────────────

// "bg-xxx text-xxx" for role badge
export const getRoleClass = (role) => {
    const r = role_colors[role]
    return r ? `${r.bg} ${r.text}` : 'bg-gray-100 text-gray-500'
}

// inline style for status badge
export const getStatusStyle = (status) => {
    const s = status_color[status] ?? status_color.unknown
    return { backgroundColor: s.pale, color: s.text }
}

// hex color for KDS card header background
export const getStatusBg = (status) => status_color[status]?.bg ?? '#E5E7EB'

// hex color for KDS card border
export const getStatusText = (status) => status_color[status]?.text ?? '#6B7280'