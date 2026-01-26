import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-white border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xs">
                RO
              </div>
              <span className="text-lg font-display font-bold text-primary">Romania AI</span>
            </div>
            <p className="text-muted-foreground max-w-sm">
              The official platform for Romania's National Artificial Intelligence Strategy (2024-2027). 
              Driving innovation, ensuring compliance, and building a digital future.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-4">Platform</h3>
            <ul className="space-y-3">
              <li><Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">Strategy Dashboard</Link></li>
              <li><Link href="/projects" className="text-muted-foreground hover:text-primary transition-colors">Project Registry</Link></li>
              <li><Link href="/compliance" className="text-muted-foreground hover:text-primary transition-colors">Compliance Simulator</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><Link href="/resources" className="text-muted-foreground hover:text-primary transition-colors">Documentation</Link></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">EU AI Act</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Government Portal</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; 2024 Government of Romania. All rights reserved.
          </p>
          <div className="flex gap-1 h-3">
            <div className="w-8 bg-blue-700 h-full rounded-l-sm"></div>
            <div className="w-8 bg-yellow-400 h-full"></div>
            <div className="w-8 bg-red-600 h-full rounded-r-sm"></div>
          </div>
        </div>
      </div>
    </footer>
  );
}
