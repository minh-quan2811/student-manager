"""add_related_request_id_to_notifications

Revision ID: a1b2c3d4e5f6
Revises: edd1ea45f6d3
Create Date: 2025-11-27 14:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a1b2c3d4e5f6'
down_revision = 'edd1ea45f6d3'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('notifications', sa.Column('related_request_id', sa.Integer(), nullable=True))


def downgrade():
    op.drop_column('notifications', 'related_request_id')
