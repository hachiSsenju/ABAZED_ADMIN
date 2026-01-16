"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Activity, Package, Users, Settings, Eye, ChevronDown } from "lucide-react"
import { historiqueService } from "@/services/historiqueService"
import { HistoriqueItem, HistoriqueValueUser, HistoriqueValueCategorie, HistoriqueValueProduit } from "@/types/historique"

export default function ActivityLogsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [logs, setLogs] = useState<HistoriqueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await historiqueService.getAll();
        setLogs(data);
      } catch (error) {
        console.error("Failed to fetch logs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const toggleRow = (index: number) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(index)) {
      newExpandedRows.delete(index);
    } else {
      newExpandedRows.add(index);
    }
    setExpandedRows(newExpandedRows);
  };

  const getIcon = (entity: string) => {
    switch (entity) {
      case "Produit":
        return <Package className="h-4 w-4" />
      case "User":
        return <Users className="h-4 w-4" />
      case "Categorie":
        return <Activity className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getTypeBadgeVariant = (entity: string) => {
    switch (entity) {
      case "Produit":
        return "default"
      case "User":
        return "secondary"
      case "Categorie":
        return "outline"
      default:
        return "secondary"
    }
  }

  const formatLog = (log: HistoriqueItem) => {
    let action = `${log.entity} ${log.action}`;
    let details = "";
    let user = "System";

    if (log.entity === 'User') {
      const val = log.value as HistoriqueValueUser;
      details = `${log.action}d user ${val.nom} ${val.prenom} (${val.email})`;
    } else if (log.entity === 'Categorie') {
      const val = log.value as HistoriqueValueCategorie;
      details = `${log.action}d category ${val.nom}`;
    } else if (log.entity === 'Produit') {
      const val = log.value as HistoriqueValueProduit;
      details = `${log.action}d product ${val.nom}`;
    }

    return { action, details, user };
  }

  const renderDetails = (log: HistoriqueItem) => {
    return (
      <div className="p-4 bg-muted/50 rounded-md">
        <h4 className="font-semibold mb-2">Detailed Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 className="text-sm font-medium mb-1">Current Value</h5>
            <pre className="text-xs bg-background p-2 rounded border overflow-auto max-h-[200px]">
              {JSON.stringify(log.value, null, 2)}
            </pre>
          </div>
          {log.prevValue && (
            <div>
              <h5 className="text-sm font-medium mb-1">Previous Value</h5>
              <pre className="text-xs bg-background p-2 rounded border overflow-auto max-h-[200px]">
                {JSON.stringify(log.prevValue, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    );
  };

  const filteredLogs = logs.filter((log) => {
    const { action, details, user } = formatLog(log);
    const matchesSearch =
      action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.toLowerCase().includes(searchQuery.toLowerCase())

    let matchesType = true;
    if (filterType !== 'all') {
      if (filterType === 'product' && log.entity !== 'Produit') matchesType = false;
      if (filterType === 'user' && log.entity !== 'User') matchesType = false;
      if (filterType === 'system' && log.entity !== 'Categorie') matchesType = false;
    }

    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Activity Logs</h1>
        <p className="text-muted-foreground mt-1">Track all system activities and changes</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search activity logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Activities</SelectItem>
                <SelectItem value="Produit">Products</SelectItem>
                <SelectItem value="User">Users</SelectItem>
                <SelectItem value="Categorie">Categories</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">Loading...</TableCell>
                </TableRow>
              ) : filteredLogs.length > 0 ? (
                filteredLogs.map((log, index) => {
                  const { action, details, user } = formatLog(log);
                  const isExpanded = expandedRows.has(index);
                  return (
                    <>
                      <TableRow key={index} className={isExpanded ? "border-b-0" : ""}>
                        <TableCell>
                          <Badge variant={getTypeBadgeVariant(log.entity)} className="flex items-center gap-1 w-fit">
                            {getIcon(log.entity)}
                            <span className="capitalize">{log.entity}</span>
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{action}</TableCell>
                        <TableCell className="text-muted-foreground">{user}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{log.created_at || "N/A"}</TableCell>
                        <TableCell className="text-sm">{details}</TableCell>
                        <TableCell className="text-sm">
                          <button
                            onClick={() => toggleRow(index)}
                            className="p-1 hover:bg-muted rounded-full transition-colors"
                          >
                            <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                          </button>
                        </TableCell>
                      </TableRow>
                      {isExpanded && (
                        <TableRow key={`${index}-details`}>
                          <TableCell colSpan={6} className="bg-muted/30 p-0">
                            <div className="p-4">
                              {renderDetails(log)}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">No logs found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
