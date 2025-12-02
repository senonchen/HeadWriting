import { Redis } from '@upstash/redis';

// 自动读取 Vercel 环境变量连接 Upstash
const redis = Redis.fromEnv();

// 数据库里的 Key 名称
const DB_KEY = 'handwriting_episodes_v1';

// 默认数据（如果数据库是空的，显示这些）
const defaultData = [
    {
        id: 1,
        title: "第一集：数字入门",
        characters: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"]
    },
    {
        id: 2,
        title: "第二集：自然与人",
        characters: ["人", "口", "手", "山", "水", "火", "木", "日", "月"]
    }
];

export default async function handler(req, res) {
    try {
        if (req.method === 'GET') {
            // 获取数据
            const data = await redis.get(DB_KEY);
            return res.status(200).json(data || defaultData);
        } 
        else if (req.method === 'POST') {
            // 保存数据 (接收完整的数组并覆盖)
            await redis.set(DB_KEY, req.body);
            return res.status(200).json({ success: true });
        } 
        else {
            return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Database Connection Error' });
    }
}