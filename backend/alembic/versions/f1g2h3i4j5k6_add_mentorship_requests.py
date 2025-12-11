"""add_mentorship_requests

Revision ID: f1g2h3i4j5k6
Revises: a1b2c3d4e5f6
Create Date: 2025-11-29 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.engine.reflection import Inspector


# revision identifiers, used by Alembic.
revision = 'f1g2h3i4j5k6'
down_revision = 'a1b2c3d4e5f6'
branch_labels = None
depends_on = None


def upgrade():
    # Create mentorship_requests table
    op.create_table(
        'mentorship_requests',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('group_id', sa.Integer(), nullable=False),
        sa.Column('professor_id', sa.Integer(), nullable=False),
        sa.Column('requested_by', sa.Integer(), nullable=False),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('status', sa.String(), nullable=False, server_default='pending'),
        sa.Column('rejection_reason', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('responded_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['group_id'], ['groups.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['professor_id'], ['professors.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['requested_by'], ['students.id'], ondelete='CASCADE'),
    )
    op.create_index('ix_mentorship_requests_id', 'mentorship_requests', ['id'])
    op.create_index('ix_mentorship_requests_status', 'mentorship_requests', ['status'])
    op.create_index('ix_mentorship_requests_professor_id', 'mentorship_requests', ['professor_id'])
    op.create_index('ix_mentorship_requests_group_id', 'mentorship_requests', ['group_id'])
    
    # Add mentor_count to groups table
    conn = op.get_bind()
    inspector = Inspector.from_engine(conn)
    columns = [col['name'] for col in inspector.get_columns('groups')]
    
    if 'mentor_count' not in columns:
        op.add_column('groups', sa.Column('mentor_count', sa.Integer(), nullable=False, server_default='0'))
        
        # Update existing rows to have correct mentor_count
        op.execute("""
            UPDATE groups
            SET mentor_count = (
                SELECT COUNT(*)
                FROM group_mentors
                WHERE group_mentors.group_id = groups.id
            )
        """)


def downgrade():
    # Drop mentor_count column from groups
    op.drop_column('groups', 'mentor_count')
    
    # Drop mentorship_requests table
    op.drop_index('ix_mentorship_requests_group_id', table_name='mentorship_requests')
    op.drop_index('ix_mentorship_requests_professor_id', table_name='mentorship_requests')
    op.drop_index('ix_mentorship_requests_status', table_name='mentorship_requests')
    op.drop_index('ix_mentorship_requests_id', table_name='mentorship_requests')
    op.drop_table('mentorship_requests')