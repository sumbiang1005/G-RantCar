import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import toast from 'react-hot-toast'
import { 
    FaWhatsapp, 
    FaEnvelope, 
    FaPaperPlane, 
    FaTimes, 
    FaHeadset,
    FaRobot,
    FaUser,
    FaComments
} from 'react-icons/fa'

const LiveChat = () => {
    const { user } = useAuth()
    const { theme } = useTheme()
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef(null)

    const waNumber = '62895402462465'
    const supportEmail = 'sumbiang1005@gmail.com'

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([
                { id: 1, sender: 'support', message: `Halo! Ada yang bisa kami bantu?\n\nWhatsApp: 0895402462465\nEmail: ${supportEmail}`, time: new Date().toLocaleTimeString(), isSupport: true },
            ])
        }
    }, [isOpen])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const sendMessage = () => {
        if (!newMessage.trim()) return
        
        const userMessage = {
            id: Date.now(),
            sender: 'user',
            message: newMessage,
            time: new Date().toLocaleTimeString(),
            isSupport: false
        }
        setMessages(prev => [...prev, userMessage])
        setNewMessage('')
        
        setIsTyping(true)
        
        setTimeout(() => {
            let reply = ''
            const lowerMsg = newMessage.toLowerCase()
            
            if (lowerMsg.includes('harga') || lowerMsg.includes('price')) {
                reply = 'Untuk informasi harga lengkap, silakan cek halaman detail mobil.'
            } else if (lowerMsg.includes('sewa') || lowerMsg.includes('rent')) {
                reply = 'Proses sewa sangat mudah. Pilih mobil, pilih tanggal, lalu konfirmasi pembayaran.'
            } else if (lowerMsg.includes('promo') || lowerMsg.includes('diskon')) {
                reply = 'Saat ini ada promo GRANT10 untuk diskon 10%. Gunakan kode tersebut saat checkout.'
            } else if (lowerMsg.includes('thanks') || lowerMsg.includes('thank')) {
                reply = 'Sama-sama. Senang bisa membantu.'
            } else {
                reply = `Terima kasih atas pesannya. Tim support kami akan segera merespon.\n\nWhatsApp: 0895402462465\nEmail: ${supportEmail}`
            }
            
            const supportReply = {
                id: Date.now() + 1,
                sender: 'support',
                message: reply,
                time: new Date().toLocaleTimeString(),
                isSupport: true
            }
            setMessages(prev => [...prev, supportReply])
            setIsTyping(false)
            toast.success('Pesan terkirim')
        }, 1500)
    }

    const openWhatsApp = () => {
        window.open(`https://wa.me/${waNumber}`, '_blank')
    }

    const openEmail = () => {
        window.location.href = `mailto:${supportEmail}?subject=Support Request&body=Halo, saya ingin bertanya tentang...`
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    const getChatBgClass = () => {
        if (theme === 'cyberpunk') return 'bg-[#1a1a4a] border-cyan-500/30'
        if (theme === 'dark') return 'bg-gray-800 border-gray-700'
        return 'bg-white border-gray-200 shadow-xl'
    }

    const getMessageBgClass = (isSupport) => {
        if (isSupport) {
            if (theme === 'cyberpunk') return 'bg-[#0a0a2a] text-cyan-300'
            if (theme === 'dark') return 'bg-gray-700 text-gray-200'
            return 'bg-gray-100 text-gray-800'
        } else {
            return 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
        }
    }

    const getInputClass = () => {
        if (theme === 'cyberpunk') return 'bg-[#0a0a2a] border-cyan-500/30 text-cyan-300'
        if (theme === 'dark') return 'bg-gray-700 border-gray-600 text-white'
        return 'bg-gray-50 border-gray-200 text-gray-900'
    }

    if (!user) return null

    return (
        <>
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg flex items-center justify-center text-2xl z-40 hover:shadow-xl transition-all cursor-pointer"
            >
                <FaComments className="w-6 h-6 text-white" />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className={`fixed bottom-24 right-6 w-96 h-[550px] rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col ${getChatBgClass()}`}
                    >
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">
                                        <FaHeadset className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white flex items-center gap-2">
                                            Customer Support
                                            <span className="text-[10px] bg-green-500 text-white px-2 py-0.5 rounded-full">Online</span>
                                        </h3>
                                        <div className="flex items-center gap-1 mt-0.5">
                                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                            <p className="text-xs text-blue-100">Respon cepat</p>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setIsOpen(false)} className="text-white text-xl hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center">
                                    <FaTimes className="w-4 h-4" />
                                </button>
                            </div>
                            
                            <div className="flex gap-2 mt-3">
                                <button onClick={openWhatsApp} className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
                                    <FaWhatsapp className="w-4 h-4" />
                                    WhatsApp
                                </button>
                                <button onClick={openEmail} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
                                    <FaEnvelope className="w-4 h-4" />
                                    Email
                                </button>
                            </div>
                        </div>

                        <div className={`flex-1 overflow-y-auto p-4 space-y-3 ${theme === 'cyberpunk' ? 'bg-[#0a0a2a]' : theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.isSupport ? 'justify-start' : 'justify-end'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-2xl ${msg.isSupport ? 'rounded-bl-none' : 'rounded-br-none'} ${getMessageBgClass(msg.isSupport)}`}>
                                        {msg.isSupport && (
                                            <div className="flex items-center gap-1 mb-1">
                                                <FaHeadset className="w-3 h-3 text-blue-600" />
                                                <span className="text-xs font-semibold text-blue-600">Support</span>
                                                <span className="text-xs text-gray-400">•</span>
                                                <span className="text-xs text-gray-400">{msg.time}</span>
                                            </div>
                                        )}
                                        <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                                        {!msg.isSupport && (
                                            <div className="flex items-center justify-end gap-1 mt-1">
                                                <FaUser className="w-3 h-3 text-blue-200" />
                                                <p className="text-xs text-blue-200">{msg.time}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className={`p-3 rounded-2xl rounded-bl-none ${theme === 'cyberpunk' ? 'bg-[#0a0a2a]' : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                        <div className="flex gap-1">
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className={`p-3 border-t ${theme === 'cyberpunk' ? 'border-cyan-500/30' : 'border-gray-200 dark:border-gray-700'}`}>
                            <div className="flex gap-2">
                                <textarea 
                                    value={newMessage} 
                                    onChange={(e) => setNewMessage(e.target.value)} 
                                    onKeyPress={handleKeyPress} 
                                    placeholder="Tulis pesan..." 
                                    rows="1" 
                                    className={`flex-1 px-4 py-2 rounded-xl border focus:outline-none focus:border-blue-500 resize-none ${getInputClass()}`} 
                                    style={{ minHeight: '44px', maxHeight: '100px' }} 
                                />
                                <motion.button 
                                    whileHover={{ scale: 1.05 }} 
                                    whileTap={{ scale: 0.95 }} 
                                    onClick={sendMessage} 
                                    disabled={!newMessage.trim()} 
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2 rounded-xl font-semibold disabled:opacity-50 flex items-center gap-2"
                                >
                                    <FaPaperPlane className="w-4 h-4" />
                                    Kirim
                                </motion.button>
                            </div>
                            <p className="text-xs text-gray-400 text-center mt-2 flex items-center justify-center gap-1">
                                <FaWhatsapp className="w-3 h-3 text-green-500" />
                                Support: 0895402462465
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default LiveChat