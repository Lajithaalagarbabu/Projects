import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Loading from '../components/Loading';
import eventService from '../services/eventService';
import { Users, UserPlus, Trash2, ArrowLeft, Check, AlertCircle, Shield } from 'lucide-react';
import '../styles/dashboard.css';

export const TeamManagement = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [assignedMembers, setAssignedMembers] = useState([]);
  const [allTeamMembers, setAllTeamMembers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadData();
  }, [eventId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [eventData, membersData, allUsersData] = await Promise.all([
        eventService.getAdminEventById(eventId),
        eventService.getEventMembers(eventId),
        eventService.getAvailableTeamMembers(),
      ]);
      setEvent(eventData);
      setAssignedMembers(membersData);
      setAllTeamMembers(allUsersData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load team data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!selectedUserId) return;
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      await eventService.addMemberToEvent(eventId, parseInt(selectedUserId));
      setSuccess('Team member assigned successfully!');
      setSelectedUserId('');
      const updatedMembers = await eventService.getEventMembers(eventId);
      setAssignedMembers(updatedMembers);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign team member');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Remove this team member from the event?')) return;
    setError('');
    setSuccess('');

    try {
      await eventService.removeMemberFromEvent(eventId, userId);
      setAssignedMembers(assignedMembers.filter((m) => m.id !== userId));
      setSuccess('Team member removed from event.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove member');
    }
  };

  const unassignedUsers = allTeamMembers.filter(
    (user) => !assignedMembers.some((m) => m.id === user.id)
  );

  if (loading) return <><Navbar /><Loading text="Loading team assignments..." /></>;

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to={`/admin/events/${eventId}`} className="nav-link" style={{ display: 'inline-flex', marginBottom: '1rem' }}>
            <ArrowLeft size={16} />
            <span>Back to Event Details</span>
          </Link>
          <div className="dashboard-header">
            <div>
              <h1 className="dashboard-title">Team Management</h1>
              <p className="dashboard-subtitle">Assign photographers to "{event?.name}"</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <Check size={18} />
            <span>{success}</span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* Add Team Member Card */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UserPlus size={20} color="var(--primary)" />
              <span>Assign New Team Member</span>
            </h3>

            {unassignedUsers.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', padding: '1rem 0' }}>
                All available Team Members are currently assigned to this event, or no Team Members exist in the system yet.
              </p>
            ) : (
              <form onSubmit={handleAddMember}>
                <div className="form-group">
                  <label className="form-label">Select Team Member</label>
                  <select
                    className="form-input"
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    required
                  >
                    <option value="">-- Choose Photographer --</option>
                    {unassignedUsers.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '0.5rem' }}
                  disabled={submitting}
                >
                  <UserPlus size={16} />
                  <span>{submitting ? 'Assigning...' : 'Assign Photographer'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Assigned Members List */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={20} color="var(--accent)" />
              <span>Assigned Team Members ({assignedMembers.length})</span>
            </h3>

            {assignedMembers.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', padding: '1rem 0' }}>
                No team members assigned yet. Photographers must be assigned to upload photos for this event.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {assignedMembers.map((member) => (
                  <div
                    key={member.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.85rem 1rem',
                      background: 'rgba(10, 13, 20, 0.6)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div className="user-avatar" style={{ width: 34, height: 34, fontSize: '0.8rem' }}>
                        {member.name ? member.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
                          {member.name}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {member.email}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="btn btn-danger btn-sm"
                      title="Remove Member"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TeamManagement;
