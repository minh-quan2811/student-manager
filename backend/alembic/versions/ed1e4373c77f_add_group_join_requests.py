"""add_group_join_requests

Revision ID: ed1e4373c77f
Revises: 611125a8a4cc
Create Date: 2025-11-26 22:44:49.029989

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ed1e4373c77f'
down_revision = '611125a8a4cc'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create group_join_requests table
    op.create_table('group_join_requests',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('group_id', sa.Integer(), nullable=True),
    sa.Column('student_id', sa.Integer(), nullable=True),
    sa.Column('message', sa.String(), nullable=True),
    sa.Column('status', sa.String(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['group_id'], ['groups.id'], ),
    sa.ForeignKeyConstraint(['student_id'], ['students.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_group_join_requests_id'), 'group_join_requests', ['id'], unique=False)


def downgrade() -> None:
    # Drop the table and index
    op.drop_index(op.f('ix_group_join_requests_id'), table_name='group_join_requests')
    op.drop_table('group_join_requests')