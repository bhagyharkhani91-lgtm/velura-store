import { useState } from 'react';
import { Button } from '../../../components/ui/Button/Button';
import { Search, Download, Package, AlertTriangle } from 'lucide-react';
import { useOrdersStore } from '../../../stores/ordersStore';
import { useShipmentStore } from '../../../stores/shipmentStore';
import { formatPrice } from '../../../utils';
import type { Order } from '../../../types/order';
import { useProductStore } from '../../../stores/productStore';
import { OrderDetailsModal } from './components/OrderDetailsModal';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Modal } from '../../../components/ui/Modal/Modal';

const TABS = [
  { id: 'today', label: 'Today', statuses: ['processing'] },
  { id: 'pending', label: 'Pending', statuses: ['pending'] },
  { id: 'ready-to-ship', label: 'Ready to Ship', statuses: ['confirmed'] },
  { id: 'shipped', label: 'Shipped', statuses: ['shipped', 'delivered'] },
  { id: 'cancelled', label: 'Cancelled', statuses: ['cancelled', 'refunded', 'returned'] }
];

const isToday = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};

export function AdminOrdersPage() {
  const { orders, updateOrderStatus, updatePaymentStatus } = useOrdersStore();
  const { createShipment } = useShipmentStore();
  const { products } = useProductStore();
  const [activeTab, setActiveTab] = useState('today');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [exportStartDate, setExportStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [exportEndDate, setExportEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [exportAllTime, setExportAllTime] = useState(false);
  const [acceptLoading, setAcceptLoading] = useState<string | null>(null);
  const [acceptError, setAcceptError] = useState<string | null>(null);

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'today') {
      return isToday(order.createdAt);
    }
    const tab = TABS.find(t => t.id === activeTab);
    return tab ? tab.statuses.includes(order.status) : true;
  });

  const handleAccept = async (order: Order) => {
    setAcceptLoading(order.id);
    setAcceptError(null);
    try {
      await updateOrderStatus(order.id, 'confirmed' as any);
      await createShipment({
        id: order.id,
        orderNumber: order.orderNumber,
        items: order.items.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        subtotal: order.subtotal,
        shippingAddress: {
          firstName: order.shippingAddress.firstName,
          lastName: order.shippingAddress.lastName,
          street: order.shippingAddress.street,
          apartment: order.shippingAddress.apartment,
          city: order.shippingAddress.city,
          state: order.shippingAddress.state,
          zipCode: order.shippingAddress.zipCode,
          country: order.shippingAddress.country,
          phone: order.shippingAddress.phone,
          email: (order.shippingAddress as any).email,
        },
        paymentMethod: order.paymentMethod,
      });
    } catch (err: any) {
      setAcceptError(err.message || 'Failed to create shipment. Order accepted but shipment creation failed.');
    } finally {
      setAcceptLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-success-muted text-success border border-success/20';
      case 'shipped':
      case 'sent': return 'bg-info-muted text-info border border-info/20';
      case 'pending': return 'bg-warning-muted text-warning border border-warning/20';
      case 'cancelled': return 'bg-error-muted text-error border border-error/20';
      default: return 'bg-bg-secondary text-secondary border border-border';
    }
  };

  const exportCSV = () => {
    if (filteredOrders.length === 0) return;
    
    const headers = ['Order ID', 'Date', 'Customer Name', 'Customer Email', 'Phone', 'City', 'State', 'Status', 'Total', 'Payment Method'];
    
    const csvData = filteredOrders.map(order => [
      order.orderNumber,
      new Date(order.createdAt).toLocaleDateString('en-IN'),
      `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
      (order.shippingAddress as any).email || '',
      order.shippingAddress.phone || '',
      order.shippingAddress.city || '',
      order.shippingAddress.state || '',
      order.status,
      order.total,
      order.paymentMethod
    ]);
    
    const csvContent = [headers, ...csvData]
      .map(row => row.map(item => `"${String(item).replace(/"/g, '""')}"`).join(","))
      .join("\n");
      
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `adult-store_orders_${activeTab}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateOrdersPDF = () => {
    let pdfOrders = orders;
    
    if (!exportAllTime) {
      const start = new Date(exportStartDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(exportEndDate);
      end.setHours(23, 59, 59, 999);
      
      pdfOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= start && orderDate <= end;
      });
    }

    if (pdfOrders.length === 0) {
      return;
    }

    const aggregatedData: Record<string, { sku: string; color: string; size: string; quantity: number }> = {};
    
    pdfOrders.forEach(order => {
      order.items.forEach(item => {
        const product = products.find((p: any) => p.id === item.productId);
        let sku = item.name;
        let color = 'NA';
        let size = 'Free Size';
        
        if (product) {
          if (item.variantId) {
            const variant = product.variants.find((v: any) => v.id === item.variantId);
            if (variant) {
              sku = variant.sku || variant.name || sku;
              color = variant.color || 'NA';
              size = variant.size || 'Free Size';
            }
          } else {
             if (product.variants.length > 0) {
                 sku = product.variants[0].sku || product.slug;
             } else {
                 sku = product.slug || item.productId;
             }
          }
        }

        if (color === 'NA' && size === 'Free Size' && item.variant) {
           const parts = item.variant.split('/').map(s => s.trim());
           if (parts.length === 2) {
             color = parts[0];
             size = parts[1];
           } else if (parts.length === 1) {
             color = parts[0];
           }
        }

        const key = `${sku}_${color}_${size}`;
        if (!aggregatedData[key]) {
          aggregatedData[key] = { sku, color, size, quantity: 0 };
        }
        aggregatedData[key].quantity += item.quantity;
      });
    });

    const doc = new jsPDF();
    let titleDateStr = 'All Time';
    if (!exportAllTime) {
      const startStr = new Date(exportStartDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, ' ');
      const endStr = new Date(exportEndDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, ' ');
      titleDateStr = startStr === endStr ? startStr : `${startStr} - ${endStr}`;
    }
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`Date : ${titleDateStr}`, 14, 20);

    const tableBody = Object.values(aggregatedData).map(row => [
      row.sku, row.color, row.size, row.quantity.toString()
    ]);

    autoTable(doc, {
      startY: 28,
      head: [['SKU', 'Color', 'Size', 'Total Quantity']],
      body: tableBody,
      theme: 'grid',
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
        fontStyle: 'bold',
        halign: 'center',
      },
      bodyStyles: {
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
        halign: 'center',
      },
      styles: {
        font: 'helvetica',
        fontSize: 10,
        cellPadding: 4,
      }
    });

    doc.save(`today_orders_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div>
      {acceptError && (
        <div className="mb-4 p-3 bg-error-muted border border-error/30 rounded-lg flex items-center gap-2 text-sm text-error">
          <AlertTriangle size={16} />
          <span>{acceptError}</span>
          <button onClick={() => setAcceptError(null)} className="ml-auto text-error hover:underline text-xs">&times; Dismiss</button>
        </div>
      )}
      <div className="flex justify-between items-center mb-6">
        <h1 className="heading-3xl">Orders Management</h1>
        <Button variant="outline" leftIcon={<Download size={18} />} onClick={exportCSV} disabled={filteredOrders.length === 0}>Export CSV</Button>
      </div>

      <div className="bg-surface rounded-lg border border-border overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-border">
          {TABS.map(tab => {
            const count = tab.id === 'today' 
              ? orders.filter(o => isToday(o.createdAt)).length 
              : orders.filter(o => tab.statuses.includes(o.status)).length;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
                  isActive 
                    ? 'border-accent text-accent' 
                    : 'border-transparent text-secondary hover:text-primary'
                }`}
              >
                {tab.label}
                {['today', 'pending', 'ready-to-ship'].includes(tab.id) && (
                  <span>({count})</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-border flex justify-between items-center bg-bg-secondary/20">
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              leftIcon={<Download size={18} />}
              onClick={() => setIsPdfModalOpen(true)}
              style={{ color: 'var(--color-error)', borderColor: 'var(--color-error)' }}
            >
              EXPORT PDF
            </Button>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative h-[42px]">
              <select 
                className="bg-surface border border-border rounded-md text-sm text-secondary focus:outline-none focus:border-accent cursor-pointer h-full transition-colors w-full"
                style={{ 
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  paddingLeft: '1rem',
                  paddingRight: '2.5rem',
                  minWidth: '140px' 
                }}
              >
                <option>SKU ID</option>
                <option>Order ID</option>
                <option>Customer Email</option>
              </select>
              <div 
                className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ right: '0.75rem' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
            
            <div className="relative h-[42px] flex items-center">
              <input 
                type="text" 
                placeholder="Search orders..." 
                className="bg-surface border border-border rounded-md text-sm text-primary focus:outline-none focus:border-accent h-full transition-colors w-full"
                style={{ 
                  paddingLeft: '1rem',
                  paddingRight: '2.5rem',
                  width: '260px' 
                }}
              />
              <Search 
                className="absolute text-secondary" 
                size={16} 
                style={{ right: '0.75rem' }}
              />
            </div>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-surface">
            <div className="relative mb-6">
              <Package size={56} strokeWidth={1} className="text-secondary/60" />
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3.5 h-5 bg-secondary/30"></div>
              <div className="absolute bottom-1 -left-4 w-5 h-[1px] bg-border"></div>
              <div className="absolute bottom-3 -left-4 w-3 h-[1px] bg-border"></div>
              <div className="absolute bottom-0 -right-6 w-12 h-[1px] bg-border"></div>
              <div className="absolute bottom-0 -left-6 w-16 h-[1px] bg-border"></div>
            </div>
            <h3 className="text-base font-semibold text-primary mb-1">No orders yet</h3>
            <p className="text-sm text-secondary">But keep checking this section from time to time.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-secondary/30 text-secondary text-sm border-b border-border">
                <th className="p-4 font-medium">Order ID</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Total</th>
                <th className="p-4 font-medium">Payment</th>
                <th className="p-4 font-medium">Fulfillment</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id} className="border-b border-border hover:bg-bg-hover transition-colors">
                  <td className="p-4 font-medium text-primary">#{order.orderNumber}</td>
                  <td className="p-4 text-secondary">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-primary">
                      {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                    </p>
                    <p className="text-xs text-secondary">{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                  </td>
                  <td className="p-4 font-medium">{formatPrice(order.total)}</td>
                  <td className="p-4">
                    <span className="text-xs bg-success-muted text-success px-2 py-1 rounded">{order.paymentMethod}</span>
                  </td>
                  <td className="p-4">
                    {activeTab === 'today' ? (
                      <span className={`inline-block text-xs px-2.5 py-1 rounded-md font-semibold capitalize ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    ) : order.status === 'pending' ? (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleAccept(order)}
                          disabled={acceptLoading === order.id}
                        >
                          {acceptLoading === order.id ? 'Accepting...' : 'Accept'}
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => updateOrderStatus(order.id, 'cancelled' as any)}>
                          Decline
                        </Button>
                      </div>
                    ) : order.status === 'confirmed' ? (
                      <Button size="sm" onClick={() => updateOrderStatus(order.id, 'shipped' as any)}>
                        Sent
                      </Button>
                    ) : order.status === 'shipped' ? (
                      <div className="flex items-center gap-2">
                        <Button size="sm" onClick={() => updateOrderStatus(order.id, 'delivered' as any)}>
                          Delivered
                        </Button>
                        {order.paymentMethod === 'Cash on Delivery (COD)' && order.paymentStatus !== 'paid' && (
                          <Button size="sm" onClick={() => updatePaymentStatus(order.id, 'paid')}>
                            Paid
                          </Button>
                        )}
                      </div>
                    ) : (
                      <span className={`inline-block text-xs px-2.5 py-1 rounded-md font-semibold capitalize ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <Button 
                      size="sm" 
                      onClick={() => setSelectedOrder(order)}
                      style={{ backgroundColor: '#D4AF37', color: 'black', border: 'none' }}
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <OrderDetailsModal 
        order={selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
      />

      <Modal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        title="Export Orders to PDF"
        size="sm"
      >
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="exportAllTime"
              checked={exportAllTime}
              onChange={(e) => setExportAllTime(e.target.checked)}
              className="w-4 h-4 rounded border-border bg-bg-secondary text-accent focus:ring-accent cursor-pointer"
            />
            <label htmlFor="exportAllTime" className="text-sm font-medium text-primary cursor-pointer">
              Export All Time (Whole)
            </label>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-secondary mb-1">From Date</label>
              <input 
                type="date" 
                value={exportStartDate}
                onChange={(e) => setExportStartDate(e.target.value)}
                disabled={exportAllTime}
                className="w-full bg-surface border border-border rounded-md px-3 py-2 text-primary focus:outline-none focus:border-accent disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm text-secondary mb-1">To Date</label>
              <input 
                type="date" 
                value={exportEndDate}
                onChange={(e) => setExportEndDate(e.target.value)}
                disabled={exportAllTime}
                className="w-full bg-surface border border-border rounded-md px-3 py-2 text-primary focus:outline-none focus:border-accent disabled:opacity-50"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => setIsPdfModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              generateOrdersPDF();
              setIsPdfModalOpen(false);
            }}>
              Download PDF
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
