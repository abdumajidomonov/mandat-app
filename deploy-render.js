const axios = require('axios');
const RENDER_TOKEN = 'rnd_3ahVrCp0JIvvosq2OZhXh4k99qen';
const owner = 'abdumajidomonov';
const repo = 'mandat-app';

async function deployToRender() {
    try {
        console.log('1. Render owner olinmoqda...');
        const renderOwnerRes = await axios.get('https://api.render.com/v1/owners', {
            headers: { Authorization: `Bearer ${RENDER_TOKEN}` }
        });
        const ownerId = renderOwnerRes.data[0].owner.id;
        console.log(`✅ Render akkaunt topildi (Owner ID: ${ownerId})`);
        
        require('dotenv').config();

        const servicePayload = {
            type: 'web_service',
            name: repo + '-' + Math.floor(Math.random()*1000),
            ownerId: ownerId,
            repo: `https://github.com/${owner}/${repo}`,
            autoDeploy: 'yes',
            branch: 'main',
            env: 'node',
            envVars: [
                { key: 'DATABASE_URL', value: process.env.DATABASE_URL },
                { key: 'BOT_TOKEN', value: process.env.BOT_TOKEN },
                { key: 'NODE_ENV', value: 'production' }
            ],
            serviceDetails: {
                plan: 'free',
                env: 'node',
                envSpecificDetails: {
                    buildCommand: 'npm run build',
                    startCommand: 'npm start'
                }
            }
        };

        console.log('2. Web Service yaratilmoqda...');
        const deployRes = await axios.post('https://api.render.com/v1/services', servicePayload, {
            headers: { 
                Authorization: `Bearer ${RENDER_TOKEN}`,
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        });

        console.log('✅ Render Service muvaffaqiyatli yaratildi!');
        console.log(`🔗 Sayt manzili: ${deployRes.data.service.serviceDetails.url}`);

    } catch (err) {
        console.error('❌ Xatolik:', err.response ? JSON.stringify(err.response.data, null, 2) : err.message);
    }
}

deployToRender();
