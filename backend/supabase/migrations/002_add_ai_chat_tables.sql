-- Create AI Conversations table
CREATE TABLE IF NOT EXISTS ai_conversations (
    id BIGSERIAL PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    title TEXT DEFAULT 'New Conversation',
    summary TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create AI Messages table
CREATE TABLE IF NOT EXISTS ai_messages (
    id BIGSERIAL PRIMARY KEY,
    conversation_id BIGINT NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    tokens INTEGER,
    model TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create AI Context table
CREATE TABLE IF NOT EXISTS ai_context (
    id BIGSERIAL PRIMARY KEY,
    client_id UUID UNIQUE NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    business_snapshot JSONB,
    analysis_snapshot JSONB,
    call_guide_snapshot JSONB,
    last_summary TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ai_conversations_client_id ON ai_conversations(client_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_conversation_id ON ai_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_client_id ON ai_messages(client_id);
CREATE INDEX IF NOT EXISTS idx_ai_context_client_id ON ai_context(client_id);
