import React, { useState } from 'react';
import { 
  BookOpen, 
  Layers, 
  Code2, 
  CheckCircle, 
  ExternalLink, 
  ShieldAlert, 
  HelpCircle, 
  Terminal, 
  Database,
  Cpu,
  ArrowRight
} from 'lucide-react';

export default function SpringBootLearner() {
  const [selectedLayer, setSelectedLayer] = useState('service');
  const [selectedAnnotation, setSelectedAnnotation] = useState('@Transactional');

  // Layer Architecture Explanations
  const layers = [
    {
      id: 'controller',
      name: '1. Controller Layer',
      badge: '@RestController',
      color: '#6366f1',
      summary: 'HTTP Requests ko receive karna aur JSON return karna',
      why: 'Frontend (React) se aane wale HTTP calls (GET, POST) yaha aate hain. Controller ka kaam sirf input receive karna aur Service layer ko call karna hota hai. Isme direct business logic nahi likhi jati.',
      file: 'WalletController.java / OrderController.java',
      codeSnippet: `@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PostMapping("/checkout")
    public ResponseEntity<ApiResponse<OrderResponseDTO>> checkout(@Valid @RequestBody OrderCreateRequest request) {
        OrderResponseDTO order = orderService.createOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Order Placed", order));
    }
}`
    },
    {
      id: 'dto',
      name: '2. DTO Layer',
      badge: 'Data Transfer Objects',
      color: '#ec4899',
      summary: 'Data Protection & Separation from Database Entities',
      why: 'Production Rule: Kabhi bhi direct Database Entity ko frontend ko expose nahi karte. DTOs sirf wahi fields bhejte aur lete hain jo zaroori hain. Isse security badhti hai aur infinite JSON recursion bug nahi aata.',
      file: 'OrderCreateRequest.java / OrderResponseDTO.java',
      codeSnippet: `// Input Validation ke sath DTO
public class OrderCreateRequest {
    @NotNull(message = "User ID is required")
    private Long userId;

    @NotEmpty(message = "Order must contain at least one item")
    @Valid
    private List<OrderItemRequest> items;

    @NotBlank(message = "Shipping address is required")
    private String shippingAddress;
}`
    },
    {
      id: 'service',
      name: '3. Service Layer',
      badge: '@Service + @Transactional',
      color: '#10b981',
      summary: 'Core Business Logic & Money Transaction Boundaries',
      why: 'Sabse important layer! Yaha business rules check hote hain (Kya wallet me balance hai? Kya stock available hai?). Yaha @Transactional lagaya jata hai taaki paise katna aur order banna dono ek sath ho. Agar koi bhi error aaye to sab rollback ho jaye.',
      file: 'OrderService.java / WalletService.java',
      codeSnippet: `@Service
@RequiredArgsConstructor
public class OrderService {
    // Constructor Injection (Modern Spring standard)
    private final WalletService walletService;
    private final ProductRepository productRepository;

    @Transactional(rollbackFor = Exception.class)
    public OrderResponseDTO createOrder(OrderCreateRequest request) {
        // 1. Stock check karo
        // 2. Total amount calculate karo
        // 3. Wallet se payment deduct karo
        // 4. Order save karo (Sab kuch ek atomic transaction me!)
    }
}`
    },
    {
      id: 'repository',
      name: '4. Repository Layer',
      badge: 'Spring Data JPA',
      color: '#f59e0b',
      summary: 'Database Queries without writing manual SQL',
      why: 'Aapko "SELECT * FROM..." ya "INSERT INTO..." SQL queries likhne ki zaroorat nahi hoti! Sirf JpaRepository interface extend karo, Spring Boot background me khud SQL execute kar deta hai.',
      file: 'WalletRepository.java / OrderRepository.java',
      codeSnippet: `@Repository
public interface WalletRepository extends JpaRepository<Wallet, Long> {
    // Method naam se Spring JPA khud SQL query generate karta hai!
    Optional<Wallet> findByUserId(Long userId);
}`
    },
    {
      id: 'entity',
      name: '5. Entity Layer',
      badge: '@Entity + @Table',
      color: '#8b5cf6',
      summary: 'Database Tables ka Java Representation (ORM)',
      why: 'Hibernate ORM in Java classes ko direct SQL Tables me convert karta hai. Har variable ek table column ban jata hai. Wallet me @Version lagaya hai jo double-spending rokta hai.',
      file: 'Wallet.java / Order.java / Product.java',
      codeSnippet: `@Entity
@Table(name = "wallets")
public class Wallet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Banking me hamesha BigDecimal use karte hain!
    private BigDecimal balance;

    // Optimistic locking version
    @Version
    private Long version;
}`
    }
  ];

  // Annotations Cheatsheet
  const annotations = [
    {
      name: '@Transactional',
      desc: 'Financial integrity ka sabse bada rakshak! Agar method me koi bhi Exception aayi to database me hua koi bhi change (jaise wallet deduction ya stock decrement) turant rollback ho jayega. Half-done transactions se bachata hai.'
    },
    {
      name: '@RestController',
      desc: '@Controller + @ResponseBody ka combination. Iska matlab hai ki aapka controller JSON format me data return karega, koi purana HTML view page nahi.'
    },
    {
      name: '@RequiredArgsConstructor',
      desc: 'Lombok ka annotation jo final fields ke liye automatic Constructor banata hai. Modern production Spring Boot me @Autowired field injection ki jagah Constructor Injection best practice mani jati hai.'
    },
    {
      name: '@Version',
      desc: 'Optimistic Locking! Agar do log ek hi second me ek hi wallet se paise katne ki koshish karein to ye concurrency collision detect karke duplicate deduction rok deta hai.'
    },
    {
      name: '@RestControllerAdvice',
      desc: 'Global Exception Handler! Application me kisi bhi jagah exception aane par application crash hone ki jagah clean aur user-friendly JSON error response return hota hai.'
    },
    {
      name: '@Valid & @NotNull',
      desc: 'Bean Validation! Request aate hi fields check ho jati hain. Agar user ne amount null ya 0 bheja to method run hone se pehle hi error throw ho jata hai.'
    }
  ];

  const currentLayerData = layers.find(l => l.id === selectedLayer);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Intro Banner */}
      <div className="glass-panel" style={{
        padding: '32px',
        background: 'radial-gradient(ellipse at top left, rgba(16, 185, 129, 0.15) 0%, rgba(17, 24, 39, 0.9) 70%)',
        border: '1px solid rgba(16, 185, 129, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'rgba(16, 185, 129, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <BookOpen size={20} color="#10b981" />
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800, color: '#ffffff' }}>
            Spring Boot Demystifier & Production Guide
          </h2>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '840px', lineHeight: 1.6 }}>
          Spring Boot ka fobia bilkul naturally khatam karne ke liye ye guide banayi gayi hai.
          Neeche diye gaye interactive diagram me har layer par click karke dekhein ki React se le kar Database tak
          ek-ek line code kaise kaam karta hai.
        </p>

        {/* Live Exploration Quick Links */}
        <div style={{ display: 'flex', gap: '14px', marginTop: '20px', flexWrap: 'wrap' }}>
          <a
            href="http://localhost:8080/swagger-ui.html"
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#818cf8', borderColor: 'rgba(99, 102, 241, 0.3)' }}
          >
            <Terminal size={14} />
            Open Swagger UI Docs (/swagger-ui.html)
            <ExternalLink size={12} />
          </a>

          <a
            href="http://localhost:8080/h2-console"
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.3)' }}
          >
            <Database size={14} />
            Open H2 Database Console (/h2-console)
            <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {/* Interactive Layer Pipeline */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 700, color: '#ffffff', marginBottom: '16px' }}>
          Interactive Request Pipeline (Click any layer to inspect)
        </h3>

        {/* Pipeline Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
          marginBottom: '28px'
        }}>
          {layers.map(layer => {
            const isSelected = selectedLayer === layer.id;
            return (
              <button
                key={layer.id}
                onClick={() => setSelectedLayer(layer.id)}
                style={{
                  background: isSelected ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                  border: isSelected ? `2px solid ${layer.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '14px',
                  padding: '16px 14px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: isSelected ? `0 0 20px ${layer.color}40` : 'none'
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: layer.color, textTransform: 'uppercase', marginBottom: '4px' }}>
                  {layer.badge}
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
                  {layer.name}
                </div>
              </button>
            );
          })}
        </div>

        {/* Layer Details Box */}
        {currentLayerData && (
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{
                  background: `${currentLayerData.color}20`,
                  color: currentLayerData.color,
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 700
                }}>
                  {currentLayerData.badge}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  File: {currentLayerData.file}
                </span>
              </div>

              <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '12px' }}>
                {currentLayerData.summary}
              </h4>

              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '16px' }}>
                <strong style={{ color: '#e2e8f0', display: 'block', marginBottom: '4px' }}>Ye Layer kyu banayi gayi? (Production Logic):</strong>
                {currentLayerData.why}
              </div>
            </div>

            {/* Code Snippet Box */}
            <div style={{
              background: '#090d16',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              padding: '16px',
              overflowX: 'auto'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-dim)', fontSize: '0.75rem', marginBottom: '10px' }}>
                <Code2 size={14} /> Sample Production Code
              </div>
              <pre style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                color: '#e2e8f0',
                lineHeight: 1.5,
                margin: 0
              }}>
                {currentLayerData.codeSnippet}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Annotations Cheatsheet Grid */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
          Important Spring Boot Annotations Simplified
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '20px' }}>
          Spring Boot ke confusing annotations ko aam bhasha me samjhein:
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '16px'
        }}>
          {annotations.map(anno => (
            <div
              key={anno.name}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '12px',
                padding: '18px'
              }}
            >
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.95rem',
                fontWeight: 700,
                color: '#818cf8',
                marginBottom: '6px'
              }}>
                {anno.name}
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {anno.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Frequently Asked Phobia-Clearing Questions */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
          <HelpCircle size={22} color="#f59e0b" />
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 700, color: '#ffffff' }}>
            Beginner Doubts & FAQs
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            padding: '16px 20px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.06)'
          }}>
            <div style={{ fontWeight: 700, color: '#f8fafc', marginBottom: '6px', fontSize: '0.95rem' }}>
              Q1. Kya Spring Boot me code direct Controller se DB me save nahi ho sakta? Service aur DTO kyu banate hain?
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              <strong>Answer:</strong> Ho to sakta hai, par use spaghetti code kehte hain jo production me fail ho jata hai. Agar aap wallet se paise katne ki logic Controller me likhoge, to kal ko mobile app, web app ya third-party webhook banate waqt wahi logic 3 jagah copy-paste karni padegi. Service layer logic ko ek jagah centralize karta hai jisse code clean aur re-usable rehta hai.
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            padding: '16px 20px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.06)'
          }}>
            <div style={{ fontWeight: 700, color: '#f8fafc', marginBottom: '6px', fontSize: '0.95rem' }}>
              Q2. Money/Fintech me double ya float kyu ban hai?
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              <strong>Answer:</strong> Java me <code>0.1 + 0.2</code> evaluate karne par <code>0.30000000000000004</code> aata hai floating point precision issue ki wajah se. Lakhon transactions hone par company ka balance sheet match nahi karega. <code>BigDecimal</code> exact precision guarantee karta hai.
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            padding: '16px 20px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.06)'
          }}>
            <div style={{ fontWeight: 700, color: '#f8fafc', marginBottom: '6px', fontSize: '0.95rem' }}>
              Q3. @Transactional real life me kaise kaam karta hai?
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              <strong>Answer:</strong> ATM machine ka example lijiye: Machine se cash nikalna aur bank account se paise katna ek hi transaction hai. Agar bank se paise kat gaye aur machine me note atak gayi, to bank paise wapas credit kar deta hai (Rollback). Hamare project me bhi: Agar product stock kam ho gaya par wallet me paise kam the, to stock wapas original quantity par aa jayega!
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
