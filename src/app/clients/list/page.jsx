'use client';
import { useEffect, useState } from 'react';
import { getAllClients, changeActive } from '@/lib/api';
import { toast } from 'react-toastify';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Link from 'next/link';
import NoData from '@/components/NoData';

export default function ClientListPage() {
    const [clients, setClients] = useState([]);
    const [editId, setEditId] = useState('')
    const [loading, setLoading] = useState(false);


    const toggleClientActive = async (clientId, status) => {
    if (editId !== '') return;
    setEditId(clientId);

    try {
        await changeActive(clientId);

        setClients(prev => {
            const updated = prev.map(client =>
                client._id === clientId
                    ? { ...client, isActive: !status }
                    : client
            );

            // 🔽 Sort by isActive (true first) then by name (A–Z)
            return updated.sort((a, b) => {
                if (b.isActive - a.isActive !== 0) {
                    return b.isActive - a.isActive; // true first
                }
                return a.name.localeCompare(b.name); // then name A–Z
            });
        });
    } catch (error) {
        console.error('Error marking attendance:', error);
        toast.error(error.response?.data?.error || 'Failed to change active.', { theme: 'colored' });
    } finally {
        setTimeout(() => {
            setEditId('');
        }, 300);
    }
};


    useEffect(() => {
        setLoading(true)
        getAllClients()
            .then(res => setClients(res.data))
            .catch(error => {
                // console.error('Error while fetch client list page:', error);
                toast.error(error.response?.data?.error || 'Failed to fetch clients. Try again.', { theme: 'colored' });
            }).finally(() => {
                setLoading(false); // ✅ Only stop loading after fetch completes
            });
    }, []);

    // useEffect(() => {
    //     console.log('[clients] :', clients);
    // }, [clients]);

    if (loading) return (<p className='text bg-center w-full'>loading...</p>)

    if (!loading && (!clients || clients.length === 0)) {
        return <NoData text={'No clients available.'} />
    }

    return (
        <div className="p-1 max-w-3xl mx-auto w-full space-y-4 px-4">
            {/* heading */}
            <div className='flex flex-row items-baseline justify-between mb-4 text-2xl font-bold'>
                Client List
            </div>

            {/* client list */}
            <ul className="space-y-4">{
                clients.map(client => (

                    // single client
                    <li key={client._id} className="flex justify-between items-center p-3 rounded-lg shadow-md shadow-gray-400 gap-2 bg-background/50">

                        {/* client name */}
                        <Link
                            href={`/dashboard/client/${client._id}`}
                            // onClick={()=>handleClick(`/client/${client._id}`)}
                            className='text-md'
                        >
                            {loading ? (
                                <AiOutlineLoading3Quarters />
                            ) : (
                                <div className='text-lg font-semibold  capitalize'>
                                    {client.name}
                                </div>
                            )}
                        </Link>

                        <div>{
                            editId === client._id ? (
                                //  active button loading icon

                                <AiOutlineLoading3Quarters className={`w-full w-4cursor-default text-center animate-spin mr-20`} />
                            ) : (
                                // set active button
                                <button onClick={() => toggleClientActive(client._id, client.isActive)} className={`space-x-2 px-2 py-1 rounded-lg w-full flex items-center border ${client.isActive ? 'border-absent bg-absent/20 text-absent' : 'border-present bg-present/20 text-present'}`}>
                                    {client.isActive ? 'Deactivate' : 'Activate'}
                                </button>
                            )
                        }</div>
                    </li>

                ))
            }</ul>

        </div>
    );
}