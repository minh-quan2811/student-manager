"""add_notifications_table

Revision ID: edd1ea45f6d3
Revises: ed1e4373c77f
Create Date: 2025-11-27 13:52:48.621675

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'edd1ea45f6d3'
down_revision = 'ed1e4373c77f'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'notifications',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('type', sa.String(), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('message', sa.String(), nullable=False),
        sa.Column('link', sa.String(), nullable=True),
        sa.Column('read', sa.Boolean(), default=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('related_group_id', sa.Integer(), nullable=True),
        sa.Column('related_student_id', sa.Integer(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['related_group_id'], ['groups.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['related_student_id'], ['students.id'], ondelete='CASCADE'),
    )
    op.create_index('ix_notifications_user_id', 'notifications', ['user_id'])
    op.create_index('ix_notifications_read', 'notifications', ['read'])

def downgrade():
    op.drop_index('ix_notifications_read')
    op.drop_index('ix_notifications_user_id')
    op.drop_table('notifications')