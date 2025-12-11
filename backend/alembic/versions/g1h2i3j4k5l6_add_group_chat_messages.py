"""add_group_chat_messages

Revision ID: g1h2i3j4k5l6
Revises: f1g2h3i4j5k6
Create Date: 2025-11-30 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'g1h2i3j4k5l6'
down_revision = 'f1g2h3i4j5k6'
branch_labels = None
depends_on = None


def upgrade():
    # Create group_chat_messages table
    op.create_table(
        'group_chat_messages',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('group_id', sa.Integer(), nullable=False),
        sa.Column('sender_id', sa.Integer(), nullable=False),
        sa.Column('sender_type', sa.String(), nullable=False),  # 'student' or 'professor'
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('edited_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('is_deleted', sa.Boolean(), default=False),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['group_id'], ['groups.id'], ondelete='CASCADE'),
    )
    op.create_index('ix_group_chat_messages_id', 'group_chat_messages', ['id'])
    op.create_index('ix_group_chat_messages_group_id', 'group_chat_messages', ['group_id'])
    op.create_index('ix_group_chat_messages_created_at', 'group_chat_messages', ['created_at'])
    
    # Create message_read_status table to track who has read which messages
    op.create_table(
        'message_read_status',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('message_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('read_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['message_id'], ['group_chat_messages.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.UniqueConstraint('message_id', 'user_id', name='unique_message_user_read')
    )
    op.create_index('ix_message_read_status_message_id', 'message_read_status', ['message_id'])
    op.create_index('ix_message_read_status_user_id', 'message_read_status', ['user_id'])


def downgrade():
    op.drop_index('ix_message_read_status_user_id', table_name='message_read_status')
    op.drop_index('ix_message_read_status_message_id', table_name='message_read_status')
    op.drop_table('message_read_status')
    
    op.drop_index('ix_group_chat_messages_created_at', table_name='group_chat_messages')
    op.drop_index('ix_group_chat_messages_group_id', table_name='group_chat_messages')
    op.drop_index('ix_group_chat_messages_id', table_name='group_chat_messages')
    op.drop_table('group_chat_messages')