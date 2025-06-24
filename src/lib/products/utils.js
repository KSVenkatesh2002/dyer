import Counter from '@/models/counter.model';
import Client from '@/models/client.model';

export async function generateSafeProductId(clientId, sariSection, createdBy) {
    const client = await Client.findOne({_id: clientId, createdBy}).lean();
    if (!client) throw new Error('Client not found');

    const clientName = client.name.toLowerCase().replace(/\s+/g, '-');
    const key = `${clientName}-${sariSection}`;

    const counter = await Counter.findOneAndUpdate(
        { key, createdBy },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );

    return `p-${key}-${counter.seq}`;
}
