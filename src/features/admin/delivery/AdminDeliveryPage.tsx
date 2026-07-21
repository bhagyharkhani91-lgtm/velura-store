import { useState, useEffect, useMemo } from 'react';
import { useShipmentStore } from '../../../stores/shipmentStore';
import { Button } from '../../../components/ui/Button/Button';
import { Modal } from '../../../components/ui/Modal/Modal';
import {
  Truck,
  Package,
  Search,
  MapPin,
  Phone,
  ExternalLink,
  Clock,
  RefreshCw,
  Hash,
  Trash2,
} from 'lucide-react';
import { formatPrice } from '../../../utils';
import { getShiprocketStatusLabel } from '../../../lib/shiprocket';
import type { Shipment } from '../../../types/shipping';
import './AdminDeliveryPage.css';

const STATUS_TABS = [
  { id: 'all', label: 'All', statuses: null },
  { id: 'NEW', label: 'New', statuses: ['NEW'] },
  { id: 'AWB_ASSIGNED', label: 'AWB Assigned', statuses: ['AWB_ASSIGNED'] },
  { id: 'PICKUP_SCHEDULED', label: 'Pickup Scheduled', statuses: ['PICKUP_SCHEDULED', 'PICKUP_QUEUED', 'PICKUP_EXCEPTION', 'PICKUP_RESCHEDULED'] },
  { id: 'IN_TRANSIT', label: 'In Transit', statuses: ['IN_TRANSIT'] },
  { id: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', statuses: ['OUT_FOR_DELIVERY'] },
  { id: 'DELIVERED', label: 'Delivered', statuses: ['DELIVERED'] },
  { id: 'CANCELLED', label: 'Cancelled', statuses: ['CANCELLED', 'RTO_INITIATED', 'RTO_DELIVERED'] },
];

export function AdminDeliveryPage() {
  const {
    shipments,
    isLoading,
    error,
    fetchShipments,
    assignAWB,
    requestPickup,
    refreshTracking,
    cancelShipment,
    generateLabel,
    deleteShipment,
  } = useShipmentStore();

  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [shiprocketError, setShiprocketError] = useState<string | null>(null);

  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

  const filteredShipments = useMemo(() => {
    let list = shipments;

    if (activeTab !== 'all') {
      const tab = STATUS_TABS.find((t) => t.id === activeTab);
      if (tab?.statuses) {
        list = list.filter((s) => tab.statuses!.includes(s.status));
      }
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.order_number?.toLowerCase().includes(q) ||
          s.awb_code?.toLowerCase().includes(q) ||
          s.customer_name?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [shipments, activeTab, search]);

  const stats = useMemo(() => {
    const total = shipments.length;
    const pending = shipments.filter((s) => s.status === 'NEW').length;
    const inTransit = shipments.filter((s) =>
      ['AWB_ASSIGNED', 'PICKUP_SCHEDULED', 'PICKUP_QUEUED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'].includes(s.status)
    ).length;
    const delivered = shipments.filter((s) => s.status === 'DELIVERED').length;
    return { total, pending, inTransit, delivered };
  }, [shipments]);

  const handleAction = async (action: string, shipment: Shipment, fn: (id: string) => Promise<void>) => {
    setActionLoading(shipment.id);
    setShiprocketError(null);
    try {
      await fn(shipment.id);
    } catch (err: any) {
      setShiprocketError(err.message || `${action} failed`);
    } finally {
      setActionLoading(null);
    }
  };

  const isActionLoading = (id: string) => actionLoading === id;

  return (
    <div className="admin-delivery">
      {error && (
        <div className="p-3 bg-error-muted border border-error/30 rounded-lg text-sm text-error">
          {error}
        </div>
      )}

      {shiprocketError && (
        <div className="p-3 bg-error-muted border border-error/30 rounded-lg text-sm text-error flex items-center justify-between">
          <span>{shiprocketError}</span>
          <button onClick={() => setShiprocketError(null)} className="text-error hover:underline text-xs">&times; Dismiss</button>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h1 className="heading-3xl">Delivery Management</h1>
        <Button
          variant="outline"
          leftIcon={<RefreshCw size={16} />}
          onClick={() => fetchShipments()}
          disabled={isLoading}
        >
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="admin-delivery-stats">
        <div className="admin-delivery-stat-card">
          <div className="admin-delivery-stat-icon total"><Package size={20} /></div>
          <div className="admin-delivery-stat-info">
            <h3>Total</h3>
            <p>{stats.total}</p>
          </div>
        </div>
        <div className="admin-delivery-stat-card">
          <div className="admin-delivery-stat-icon pending"><Clock size={20} /></div>
          <div className="admin-delivery-stat-info">
            <h3>Pending</h3>
            <p>{stats.pending}</p>
          </div>
        </div>
        <div className="admin-delivery-stat-card">
          <div className="admin-delivery-stat-icon transit"><Truck size={20} /></div>
          <div className="admin-delivery-stat-info">
            <h3>In Transit</h3>
            <p>{stats.inTransit}</p>
          </div>
        </div>
        <div className="admin-delivery-stat-card">
          <div className="admin-delivery-stat-icon delivered"><Package size={20} /></div>
          <div className="admin-delivery-stat-info">
            <h3>Delivered</h3>
            <p>{stats.delivered}</p>
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-lg border border-border overflow-hidden">
        {/* Tabs */}
        <div className="admin-delivery-tabs">
          {STATUS_TABS.map((tab) => {
            const count =
              tab.id === 'all'
                ? shipments.length
                : shipments.filter((s) => tab.statuses?.includes(s.status)).length;
            return (
              <button
                key={tab.id}
                className={`admin-delivery-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="p-3 border-b border-border flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              placeholder="Search by order #, AWB, or customer name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface border border-border rounded-md pl-9 pr-3 py-2 text-sm text-primary focus:outline-none focus:border-accent"
            />
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-secondary">Loading shipments...</div>
        ) : filteredShipments.length === 0 ? (
          <div className="admin-delivery-empty">
            <Truck size={48} strokeWidth={1} className="text-secondary/40 mb-4" />
            <h3 className="text-base font-semibold text-primary mb-1">No shipments found</h3>
            <p className="text-sm text-secondary">
              Accept orders from the Orders page to create shipments here.
            </p>
          </div>
        ) : (
          <div className="admin-delivery-table-wrapper">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-bg-secondary/30 text-secondary text-sm border-b border-border">
                  <th className="p-3 font-medium">Order #</th>
                  <th className="p-3 font-medium">Shipment ID</th>
                  <th className="p-3 font-medium">AWB</th>
                  <th className="p-3 font-medium">Customer</th>
                  <th className="p-3 font-medium">Destination</th>
                  <th className="p-3 font-medium">Courier</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium">Date</th>
                  <th className="p-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredShipments.map((shipment) => (
                  <tr
                    key={shipment.id}
                    className="border-b border-border hover:bg-bg-hover transition-colors cursor-pointer"
                    onClick={() => setSelectedShipment(shipment)}
                  >
                    <td className="p-3 font-medium text-primary">#{shipment.order_number}</td>
                    <td className="p-3 text-xs text-secondary font-mono">{shipment.shipment_id}</td>
                    <td className="p-3">
                      {shipment.awb_code ? (
                        <span className="text-sm text-primary font-mono">{shipment.awb_code}</span>
                      ) : (
                        <span className="text-sm text-secondary">--</span>
                      )}
                    </td>
                    <td className="p-3">
                      <p className="text-sm font-medium text-primary">{shipment.customer_name}</p>
                      <p className="text-xs text-secondary">{shipment.customer_phone}</p>
                    </td>
                    <td className="p-3 text-sm text-secondary">
                      {shipment.destination_city}, {shipment.destination_state}
                    </td>
                    <td className="p-3 text-sm text-secondary">
                      {shipment.courier_name || '--'}
                    </td>
                    <td className="p-3">
                      <span className={`admin-delivery-status ${shipment.status}`}>
                        {getShiprocketStatusLabel(shipment.status)}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-secondary">
                      {new Date(shipment.created_at).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <div className="admin-delivery-actions">
                        {shipment.status === 'NEW' && (
                          <Button
                            size="sm"
                            onClick={() => handleAction('AWB', shipment, assignAWB)}
                            disabled={isActionLoading(shipment.id)}
                          >
                            {isActionLoading(shipment.id) ? '...' : 'AWB'}
                          </Button>
                        )}
                        {shipment.status === 'AWB_ASSIGNED' && (
                          <Button
                            size="sm"
                            onClick={() => handleAction('Pickup', shipment, requestPickup)}
                            disabled={isActionLoading(shipment.id)}
                          >
                            {isActionLoading(shipment.id) ? '...' : 'Pickup'}
                          </Button>
                        )}
                        {shipment.awb_code && (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleAction('Track', shipment, refreshTracking)}
                              disabled={isActionLoading(shipment.id)}
                            >
                              <RefreshCw size={14} />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleAction('Label', shipment, generateLabel)}
                              disabled={isActionLoading(shipment.id)}
                            >
                              Print
                            </Button>
                          </>
                        )}
                        {!['CANCELLED', 'DELIVERED'].includes(shipment.status) && (
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => {
                              if (confirm(`Cancel shipment for order #${shipment.order_number}?`)) {
                                handleAction('Cancel', shipment, cancelShipment);
                              }
                            }}
                            disabled={isActionLoading(shipment.id)}
                          >
                            Cancel
                          </Button>
                        )}
                        {shipment.status === 'CANCELLED' && (
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => {
                              if (confirm(`Delete shipment for order #${shipment.order_number} from database?`)) {
                                handleAction('Delete', shipment, deleteShipment);
                              }
                            }}
                            disabled={isActionLoading(shipment.id)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedShipment}
        onClose={() => setSelectedShipment(null)}
        title={`Shipment Details - #${selectedShipment?.order_number || ''}`}
        size="xl"
      >
        {selectedShipment && (
          <div className="flex flex-col gap-6">
            {/* Shipment Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Hash size={14} className="text-secondary" />
                  <span className="text-sm text-secondary">Shipment ID:</span>
                  <span className="text-sm text-primary font-mono">{selectedShipment.shipment_id}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Hash size={14} className="text-secondary" />
                  <span className="text-sm text-secondary">SR Order ID:</span>
                  <span className="text-sm text-primary font-mono">{selectedShipment.sr_order_id}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck size={14} className="text-secondary" />
                  <span className="text-sm text-secondary">Courier:</span>
                  <span className="text-sm text-primary">{selectedShipment.courier_name || 'Not assigned'}</span>
                </div>
                {selectedShipment.awb_code && (
                  <div className="flex items-center gap-2">
                    <Package size={14} className="text-secondary" />
                    <span className="text-sm text-secondary">AWB:</span>
                    <span className="text-sm text-primary font-mono font-semibold">{selectedShipment.awb_code}</span>
                  </div>
                )}
                <div>
                  <span className={`admin-delivery-status ${selectedShipment.status}`}>
                    {getShiprocketStatusLabel(selectedShipment.status)}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin size={14} className="text-secondary mt-0.5" />
                  <span className="text-sm text-primary">{selectedShipment.customer_name}</span>
                </div>
                <div className="text-sm text-secondary">City: {selectedShipment.destination_city}, {selectedShipment.destination_state}</div>
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-secondary" />
                  <span className="text-sm text-primary">{selectedShipment.customer_phone}</span>
                </div>
                <div className="text-sm text-secondary">
                  Payment: {selectedShipment.payment_method}
                </div>
                <div className="text-sm text-secondary">
                  Total: {formatPrice(selectedShipment.total)}
                </div>
              </div>
            </div>

            {/* Label Link */}
            {selectedShipment.label_url && (
              <div className="bg-bg-secondary rounded-lg p-4 border border-border">
                <a
                  href={selectedShipment.label_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent text-sm flex items-center gap-1.5 hover:underline"
                >
                  <ExternalLink size={14} />
                  Download Shipping Label
                </a>
              </div>
            )}

            {/* External Track Link */}
            {selectedShipment.awb_code && (
              <div className="bg-bg-secondary rounded-lg p-4 border border-border">
                <a
                  href={`https://shiprocket.co/tracking/${selectedShipment.awb_code}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent text-sm flex items-center gap-1.5 hover:underline"
                >
                  <ExternalLink size={14} />
                  Track on Shiprocket
                </a>
              </div>
            )}

            {/* Items */}
            {selectedShipment.items && selectedShipment.items.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-primary mb-2 border-b border-border pb-2">Items</h3>
                <div className="space-y-2">
                  {selectedShipment.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-primary">{item.name} x{item.units}</span>
                      <span className="text-secondary">{formatPrice(item.selling_price * item.units)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tracking Timeline */}
            {selectedShipment.tracking_data?.scan && selectedShipment.tracking_data.scan.length > 0 ? (
              <div>
                <h3 className="text-sm font-semibold text-primary mb-3 border-b border-border pb-2">Tracking Timeline</h3>
                <div className="admin-delivery-timeline">
                  {selectedShipment.tracking_data.scan.map((entry, idx) => (
                    <div key={idx} className="admin-delivery-timeline-item">
                      <div className="admin-delivery-timeline-dot" />
                      <div className="admin-delivery-timeline-label">{entry.sr_status_label || entry.status}</div>
                      <div className="admin-delivery-timeline-location">{entry.location}</div>
                      <div className="admin-delivery-timeline-date">
                        {new Date(entry.date).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              selectedShipment.awb_code && (
                <div className="text-sm text-secondary text-center py-4">
                  No tracking data yet. Click Track to fetch updates.
                </div>
              )
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
