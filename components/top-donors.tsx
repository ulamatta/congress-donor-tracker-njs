import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Donor {
  employer: string
  total: number
  count: number
}

interface TopDonorsProps {
  donors: Donor[]
}

export function TopDonors({ donors }: TopDonorsProps) {
  // Format currency
  const formatCurrency = (value: number) => {
    if (typeof value !== "number") return "$0"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employer</TableHead>
            <TableHead className="text-right">Total Donations</TableHead>
            <TableHead className="text-right">Number of Donations</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!donors || donors.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                No donor information available.
              </TableCell>
            </TableRow>
          ) : (
            donors.map((donor, index) => (
              <TableRow key={index}>
                <TableCell>{donor.employer || "Unknown"}</TableCell>
                <TableCell className="text-right">{formatCurrency(donor.total)}</TableCell>
                <TableCell className="text-right">{donor.count || 0}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
