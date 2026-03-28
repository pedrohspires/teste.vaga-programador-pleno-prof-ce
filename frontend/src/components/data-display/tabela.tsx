import React, { isValidElement } from 'react';
import { twMerge } from 'tailwind-merge';
import { classNames } from '../../utils/classNames';

import { Button } from '../ui/button'; 

export interface TableColumn {
  className?: string;
}

interface TableProps {
  className?: string;
  children: React.ReactNode;
}

const TabelaHeader = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <thead className={twMerge(className, 'text-xs uppercase border-b border-inherit bg-gray-50/50')}>
      {children}
    </thead>
  )
}

const TabelaHeaderRow = ({ children }: { children: React.ReactNode }) => {
  return <tr>{children}</tr>
}

// Corrigido: Agora aceita atributos nativos de <th> como colSpan, title, etc.
interface HeaderCellProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  children?: React.ReactNode;
  className?: string;
}

TabelaHeaderRow.Cell = ({ children, className, ...props }: HeaderCellProps) => {
  return (
    <th
      scope="col"
      className={classNames(`px-6 py-3 bg-blue-50 text-blue-950/45`, className)}
      {...props}
    >
      {children}
    </th>
  )
}

const TabelaBody = ({ children }: { children: React.ReactNode }) => {
  return <tbody>{children}</tbody>
}

const TabelaBodyRow = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <tr className={twMerge(className, 'border-b border-inherit transition-colors hover:bg-blue-50/50')}>
      {children}
    </tr>
  )
}

// Corrigido: Agora aceita atributos nativos de <td> como colSpan, etc.
interface BodyCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children?: React.ReactNode;
  className?: string;
}

TabelaBodyRow.Cell = ({ children, className, ...props }: BodyCellProps) => {
  return (
    <td className={classNames(`px-6 py-2`, className)} {...props}>
      {children}
    </td>
  )
}

export interface TabelaFooterProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const generatePagination = (current: number, total: number) => {
  const cur = current + 1;
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  if (cur <= 4) return [1, 2, 3, 4, 5, '...', total];
  if (cur >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total];

  return [1, '...', cur - 1, cur, cur + 1, '...', total];
};

const TabelaFooter = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  className
}: TabelaFooterProps) => {

  const startItem = totalItems === 0 ? 0 : currentPage * itemsPerPage + 1;
  const endItem = Math.min((currentPage + 1) * itemsPerPage, totalItems);
  const pages = generatePagination(currentPage, totalPages);

  return (
    <div className={twMerge("flex flex-col md:flex-row items-center justify-between gap-4 px-2", className)}>
      <span className="text-sm text-slate-600">
        Exibindo <span className="font-semibold text-slate-800">{startItem}</span> a <span className="font-semibold text-slate-800">{endItem}</span> de <span className="font-semibold text-slate-800">{totalItems}</span> itens
      </span>

      <nav>
        <ul className="flex items-center gap-1 text-sm font-medium">
          <li>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="w-auto px-3 bg-transparent text-slate-500 hover:bg-slate-200"
            >
              &lt; ANT.
            </Button>
          </li>

          {pages.map((p, idx) => {
            const isActive = (p as number) - 1 === currentPage;
            
            return (
              <li key={idx}>
                {p === '...' ? (
                  <span className="px-3 py-1.5 text-slate-400 cursor-default">...</span>
                ) : (
                  <Button
                    variant={isActive ? "default" : "secondary"}
                    size="sm"
                    onClick={() => onPageChange((p as number) - 1)}
                    className={twMerge(
                      "w-auto px-3 min-w-[36px]", 
                      !isActive && "bg-transparent text-slate-600 hover:bg-slate-200"
                    )}
                  >
                    {p}
                  </Button>
                )}
              </li>
            );
          })}

          <li>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1 || totalPages === 0}
              className="w-auto px-3 bg-transparent text-slate-500 hover:bg-slate-200"
            >
              PRÓX. &gt;
            </Button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

TabelaFooter.displayName = 'TabelaFooter';

const Tabela = ({ children, className }: TableProps) => {
  const tableContent: React.ReactNode[] = [];
  let footerContent: React.ReactNode = null;

  React.Children.forEach(children, (child) => {
    if (isValidElement(child)) {
      const type: any = child.type;
      
      if (
        type === TabelaFooter || 
        type.displayName === 'TabelaFooter' || 
        type.name === 'TabelaFooter'
      ) {
        footerContent = child;
      } else {
        tableContent.push(child);
      }
    } else {
      tableContent.push(child);
    }
  });

  const classesContainer = twMerge(
    'relative overflow-x-auto shadow-md rounded-lg border border-gray-200 bg-white',
    className
  );

  return (
    <div className="w-full flex flex-col gap-4">
      
      <div className={classesContainer}>
        <table className="w-full text-sm text-left text-inherit">
          {tableContent}
        </table>
      </div>

      {footerContent}
    </div>
  );
}

TabelaBody.Row = TabelaBodyRow;
Tabela.Body = TabelaBody;
TabelaHeader.Row = TabelaHeaderRow;
Tabela.Header = TabelaHeader;
Tabela.Footer = TabelaFooter;

export default Tabela;