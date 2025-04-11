import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { apiRequest } from '@/lib/queryClient';
import { Visitor, PageVisit } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Loader2, LogOut, Clock, ArrowUpRightFromCircle, CornerLeftUp, CornerDownRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';

interface VisitorStats {
  totalVisitors: number;
  uniqueVisitors: number;
  todayVisitors: number;
  lastWeekVisitors: number;
  visitorsByCountry: { country: string; count: number }[];
  visitorsByDevice: { device: string; count: number }[];
  visitorsByBrowser: { browser: string; count: number }[];
  visitorsByOs: { os: string; count: number }[];
}

interface PageVisitStats {
  totalPageVisits: number;
  uniquePageVisits: number;
  mostVisitedPages: { path: string; count: number }[];
  averageTimeOnPage: { path: string; avgTime: number }[];
  entryPages: { path: string; count: number }[];
  exitPages: { path: string; count: number }[];
  bounceRate: number;
}

const DatabaseView = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [stats, setStats] = useState<VisitorStats | null>(null);
  const [pageVisits, setPageVisits] = useState<PageVisit[]>([]);
  const [pageVisitStats, setPageVisitStats] = useState<PageVisitStats | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState('visitors');
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch visitors
        const visitorsResponse = await fetch('/api/visitors/list');
        if (visitorsResponse.ok) {
          const visitorsData = await visitorsResponse.json();
          setVisitors(visitorsData);
        }

        // Fetch visitor stats
        const statsResponse = await fetch('/api/visitors');
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }
        
        // Fetch page visits
        try {
          const pageVisitsResponse = await fetch('/api/pagevisits/list');
          if (pageVisitsResponse.ok) {
            const pageVisitsData = await pageVisitsResponse.json();
            setPageVisits(pageVisitsData);
          }
        } catch (error) {
          console.log('Page visits endpoint not available yet');
          setPageVisits([]);
        }
        
        // Fetch page visit stats
        try {
          const pageVisitStatsResponse = await fetch('/api/pagevisits');
          if (pageVisitStatsResponse.ok) {
            const pageVisitStatsData = await pageVisitStatsResponse.json();
            setPageVisitStats(pageVisitStatsData);
          }
        } catch (error) {
          console.log('Page visit stats endpoint not available yet');
          setPageVisitStats(null);
        }

        // Fetch messages
        try {
          const messagesResponse = await fetch('/api/messages');
          if (messagesResponse.ok) {
            const messagesData = await messagesResponse.json();
            setMessages(messagesData);
          }
        } catch (error) {
          console.log('Messages endpoint not available yet');
          setMessages([]);
        }

        // Fetch users
        try {
          const usersResponse = await fetch('/api/users');
          if (usersResponse.ok) {
            const usersData = await usersResponse.json();
            setUsers(usersData);
          }
        } catch (error) {
          console.log('Users endpoint not available yet');
          setUsers([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    // Remove admin authentication
    sessionStorage.removeItem('adminAuth');
    
    // Show success message
    toast({
      title: 'Logout berhasil',
      description: 'Anda telah berhasil logout',
    });
    
    // Redirect to home
    setLocation('/');
  };
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading database data...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Database Viewer</h1>
          <Button variant="destructive" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="visitors">Visitors</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="pageVisits">Page Visits</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="visitors">
            <Card>
              <CardHeader>
                <CardTitle>Visitors</CardTitle>
                <CardDescription>List of all visitors to your website.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>IP Address</TableHead>
                        <TableHead>Browser</TableHead>
                        <TableHead>OS</TableHead>
                        <TableHead>Device</TableHead>
                        <TableHead>Country</TableHead>
                        <TableHead>Visit Count</TableHead>
                        <TableHead>Last Visit</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {visitors.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center">No visitors found</TableCell>
                        </TableRow>
                      ) : (
                        visitors.map((visitor) => (
                          <TableRow key={visitor.id}>
                            <TableCell>{visitor.id}</TableCell>
                            <TableCell>{visitor.ipAddress || 'N/A'}</TableCell>
                            <TableCell>{visitor.browser || 'N/A'}</TableCell>
                            <TableCell>{visitor.os || 'N/A'}</TableCell>
                            <TableCell>{visitor.device || 'N/A'}</TableCell>
                            <TableCell>{visitor.country || 'N/A'}</TableCell>
                            <TableCell>{visitor.visitCount}</TableCell>
                            <TableCell>{new Date(visitor.lastVisit).toLocaleString()}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats">
            <Card>
              <CardHeader>
                <CardTitle>Visitor Statistics</CardTitle>
                <CardDescription>Aggregated statistics about your website visitors.</CardDescription>
              </CardHeader>
              <CardContent>
                {!stats ? (
                  <div>No statistics available</div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stats.totalVisitors}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stats.uniqueVisitors}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Today's Visitors</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stats.todayVisitors}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Last Week Visitors</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stats.lastWeekVisitors}</div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Visitors by Country</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Country</TableHead>
                            <TableHead>Count</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {stats?.visitorsByCountry.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={2} className="text-center">No data</TableCell>
                            </TableRow>
                          ) : (
                            stats?.visitorsByCountry.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item.country}</TableCell>
                                <TableCell>{item.count}</TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Visitors by Device</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Device</TableHead>
                            <TableHead>Count</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {stats?.visitorsByDevice.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={2} className="text-center">No data</TableCell>
                            </TableRow>
                          ) : (
                            stats?.visitorsByDevice.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item.device}</TableCell>
                                <TableCell>{item.count}</TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="pageVisits">
            <Card>
              <CardHeader>
                <CardTitle>Page Visit Statistics</CardTitle>
                <CardDescription>Data and insights about how users navigate your website.</CardDescription>
              </CardHeader>
              <CardContent>
                {!pageVisitStats ? (
                  <div>No page visit statistics available</div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Page Visits</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{pageVisitStats.totalPageVisits}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Unique Page Visits</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{pageVisitStats.uniquePageVisits}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {(pageVisitStats.bounceRate * 100).toFixed(2)}%
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Pages / Visitor</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {(pageVisitStats.totalPageVisits / (stats?.uniqueVisitors || 1)).toFixed(2)}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader className="flex flex-row items-center">
                      <CardTitle className="text-sm font-medium mr-2">Most Visited Pages</CardTitle>
                      <ArrowUpRightFromCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      {pageVisitStats?.mostVisitedPages.length === 0 ? (
                        <div className="text-center py-4">No data available</div>
                      ) : (
                        pageVisitStats?.mostVisitedPages.map((item, index) => (
                          <div key={index} className="mb-4">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium truncate max-w-[250px]" title={item.path}>
                                {item.path}
                              </span>
                              <span>{item.count} views</span>
                            </div>
                            <Progress value={(item.count / Math.max(...pageVisitStats.mostVisitedPages.map(p => p.count))) * 100} />
                          </div>
                        ))
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center">
                      <CardTitle className="text-sm font-medium mr-2">Avg. Time on Page</CardTitle>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      {pageVisitStats?.averageTimeOnPage.length === 0 ? (
                        <div className="text-center py-4">No data available</div>
                      ) : (
                        pageVisitStats?.averageTimeOnPage.map((item, index) => (
                          <div key={index} className="mb-4">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium truncate max-w-[250px]" title={item.path}>
                                {item.path}
                              </span>
                              <span>{Math.floor(item.avgTime / 60)}m {Math.floor(item.avgTime % 60)}s</span>
                            </div>
                            <Progress 
                              value={(item.avgTime / Math.max(...pageVisitStats.averageTimeOnPage.map(p => p.avgTime))) * 100} 
                              className="h-2"
                            />
                          </div>
                        ))
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader className="flex flex-row items-center">
                      <CardTitle className="text-sm font-medium mr-2">Entry Pages</CardTitle>
                      <CornerLeftUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Path</TableHead>
                            <TableHead>Count</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pageVisitStats?.entryPages.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={2} className="text-center">No data</TableCell>
                            </TableRow>
                          ) : (
                            pageVisitStats?.entryPages.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell className="truncate max-w-[250px]" title={item.path}>
                                  {item.path}
                                </TableCell>
                                <TableCell>{item.count}</TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center">
                      <CardTitle className="text-sm font-medium mr-2">Exit Pages</CardTitle>
                      <CornerDownRight className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Path</TableHead>
                            <TableHead>Count</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pageVisitStats?.exitPages.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={2} className="text-center">No data</TableCell>
                            </TableRow>
                          ) : (
                            pageVisitStats?.exitPages.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell className="truncate max-w-[250px]" title={item.path}>
                                  {item.path}
                                </TableCell>
                                <TableCell>{item.count}</TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Page Visit List</CardTitle>
                <CardDescription>Detailed log of all page visits.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Visitor ID</TableHead>
                        <TableHead>Path</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Time Spent</TableHead>
                        <TableHead>Entry Page</TableHead>
                        <TableHead>Exit Page</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pageVisits.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center">No page visits found</TableCell>
                        </TableRow>
                      ) : (
                        pageVisits.map((visit) => (
                          <TableRow key={visit.id}>
                            <TableCell>{visit.id}</TableCell>
                            <TableCell>{visit.visitorId}</TableCell>
                            <TableCell className="truncate max-w-[150px]" title={visit.path}>
                              {visit.path}
                            </TableCell>
                            <TableCell className="truncate max-w-[150px]" title={typeof visit.title === 'string' ? visit.title : ''}>
                              {visit.title || 'N/A'}
                            </TableCell>
                            <TableCell>
                              {visit.timeSpent ? 
                                `${Math.floor(visit.timeSpent / 60)}m ${visit.timeSpent % 60}s` : 
                                'N/A'}
                            </TableCell>
                            <TableCell>{visit.entryPage ? 'Yes' : 'No'}</TableCell>
                            <TableCell>{visit.exitPage ? 'Yes' : 'No'}</TableCell>
                            <TableCell>{new Date(visit.timestamp).toLocaleString()}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
                <CardDescription>Contact form messages from users.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {messages.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center">No messages found</TableCell>
                        </TableRow>
                      ) : (
                        messages.map((message) => (
                          <TableRow key={message.id}>
                            <TableCell>{message.id}</TableCell>
                            <TableCell>{message.name}</TableCell>
                            <TableCell>{message.email}</TableCell>
                            <TableCell>{message.subject}</TableCell>
                            <TableCell className="max-w-xs truncate">{message.message}</TableCell>
                            <TableCell>{new Date(message.createdAt).toLocaleString()}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Users</CardTitle>
                <CardDescription>Registered users.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Username</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={2} className="text-center">No users found</TableCell>
                        </TableRow>
                      ) : (
                        users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>{user.id}</TableCell>
                            <TableCell>{user.username}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default DatabaseView;