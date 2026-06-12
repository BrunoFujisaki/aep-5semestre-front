import type { AdminUser } from "@/services/admin-users";

import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

type UsersTableProps = {
  userData: AdminUser[];
};

export const UsersTable = ({ userData }: UsersTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>E-mail</TableHead>
          <TableHead>Acesso</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {userData.length > 0 ? (
          userData.map((user) => (
            <TableRow key={user.email}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge
                  className="m-1"
                  variant={user.role === "ADMIN" ? "outline" : "default"}
                >
                  {user.role}
                </Badge>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={3} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
